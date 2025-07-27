import dotenv from "dotenv";
import fs from "fs";
import fetch from "node-fetch";
import readline from "readline";

// Load environment variables
dotenv.config();

interface ProductVariant {
  price: string;
  sku: string;
  inventoryQuantity: number;
  inventoryPolicy: string;
  requiresShipping: boolean;
}

interface ProductImage {
  src: string;
  alt: string;
}

interface Product {
  title: string;
  bodyHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  variants: ProductVariant[];
  publishedAt: string;
  images?: ProductImage[];
}

const loadProductData = (): Promise<Product> => {
  return new Promise((resolve, reject) => {
    fs.readFile("src/product.json", "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};

const testShopifyConnection = async (): Promise<{ success: boolean; locationId?: string }> => {
  const storeName = process.env.SHOPIFY_STORE_NAME;
  const apiVersion = process.env.SHOPIFY_API_VERSION;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!storeName || !apiVersion || !accessToken) {
    throw new Error("Missing required environment variables. Please check your .env file.");
  }

  const shopifyUrl = `https://${storeName}.myshopify.com/admin/api/${apiVersion}/graphql.json`;

  // Query to test connection
  const testQuery = `
    query {
      shop {
        name
        id
      }
    }
  `;

  try {
    console.log("Testing Shopify API connection...");
    const response = await fetch(shopifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query: testQuery }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    if (result.data?.shop) {
      console.log(`✅ Successfully connected to Shopify store: ${result.data.shop.name}`);
      return { success: true };
    } else {
      throw new Error("Unexpected response format from Shopify API");
    }
  } catch (error) {
    console.error("❌ Failed to connect to Shopify API:", error);
    return { success: false };
  }
};

const addProductToShopify = async (product: Product) => {
  const storeName = process.env.SHOPIFY_STORE_NAME;
  const apiVersion = process.env.SHOPIFY_API_VERSION;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!storeName || !apiVersion || !accessToken) {
    throw new Error("Missing required environment variables. Please check your .env file.");
  }

  const shopifyUrl = `https://${storeName}.myshopify.com/admin/api/${apiVersion}/graphql.json`;

  // Step 1: Create the product
  const createProductQuery = `
    mutation {
      productCreate(input: {
        title: "${product.title.replace(/"/g, '\\"')}",
        descriptionHtml: "${product.bodyHtml.replace(/"/g, '\\"').replace(/\n/g, " ")}",
        vendor: "${product.vendor.replace(/"/g, '\\"')}",
        productType: "${product.productType.replace(/"/g, '\\"')}",
        tags: ${JSON.stringify(product.tags)},
        publishedAt: "${product.publishedAt}"
      }) {
        product {
          id
          title
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
                sku
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    console.log("Creating product...");
    const response = await fetch(shopifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query: createProductQuery }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.data?.productCreate?.userErrors?.length > 0) {
      console.error("❌ Product creation errors:", result.data.productCreate.userErrors);
      return result;
    }

    if (result.data?.productCreate?.product) {
      const createdProduct = result.data.productCreate.product;
      console.log("✅ Product created successfully:", createdProduct.title);

      // Step 2: Add images if provided
      if (product.images && product.images.length > 0) {
        console.log("🖼️  Adding images...");
        for (const image of product.images) {
          const addImageQuery = `
            mutation {
              productCreateMedia(
                productId: "${createdProduct.id}",
                media: {
                  originalSource: "${image.src}",
                  mediaContentType: IMAGE
                }
              ) {
                media {
                  id
                  ... on MediaImage {
                    image {
                      url
                    }
                  }
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `;

          try {
            const imageResponse = await fetch(shopifyUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
              },
              body: JSON.stringify({ query: addImageQuery }),
            });

            if (imageResponse.ok) {
              const imageResult = await imageResponse.json();
              if (imageResult.data?.productCreateMedia?.userErrors?.length > 0) {
                console.error("❌ Image upload errors:", imageResult.data.productCreateMedia.userErrors);
              } else if (imageResult.data?.productCreateMedia?.media) {
                console.log("✅ Image added successfully");
              } else {
                console.log("⚠️  Image upload response doesn't contain expected data");
              }
            } else {
              console.error("❌ Image upload failed with status:", imageResponse.status);
            }
          } catch (error) {
            console.error("❌ Error adding image:", error);
          }
        }
      }

      // Step 2: Update the default variant with our custom data
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants[0];
        const defaultVariantId = createdProduct.variants.edges[0]?.node?.id;

        if (defaultVariantId) {
          console.log("Updating variant with custom data...");
          const updateVariantQuery = `
            mutation {
              productVariantUpdate(input: {
                id: "${defaultVariantId}",
                price: "${variant.price}",
                sku: "${variant.sku}",
                inventoryQuantities: {
                  availableQuantity: ${variant.inventoryQuantity},
                  locationId: "gid://shopify/Location/1"
                },
                requiresShipping: ${variant.requiresShipping}
              }) {
                productVariant {
                  id
                  title
                  price
                  sku
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `;

          const variantResponse = await fetch(shopifyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": accessToken,
            },
            body: JSON.stringify({ query: updateVariantQuery }),
          });

          if (variantResponse.ok) {
            const variantResult = await variantResponse.json();
            if (variantResult.data?.productVariantUpdate?.userErrors?.length > 0) {
              console.error("❌ Variant update errors:", variantResult.data.productVariantUpdate.userErrors);
            } else {
              console.log("✅ Variant updated successfully");
            }
          }
        }
      }

      return result;
    }

    return result;
  } catch (error) {
    console.error("❌ Error making API call:", error);
    throw error;
  }
};

const promptUserForConfirmation = async (product: Product): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\nProduct to be added:");
  console.log(`Title: ${product.title}`);
  console.log(`Vendor: ${product.vendor}`);
  console.log(`Type: ${product.productType}`);
  console.log(`Price: $${product.variants[0].price}`);
  console.log(`SKU: ${product.variants[0].sku}`);
  console.log(`Inventory: ${product.variants[0].inventoryQuantity}`);
  console.log(`Tags: ${product.tags.join(", ")}`);
  console.log(`Description: ${product.bodyHtml}`);

  if (product.images && product.images.length > 0) {
    console.log(`Images: ${product.images.length} image(s)`);
    product.images.forEach((img, index) => {
      console.log(`   Image ${index + 1}: ${img.src}`);
    });
  }

  return new Promise((resolve) => {
    rl.question("\nDo you want to add this product to Shopify? (yes/no): ", (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "yes" || answer.toLowerCase() === "y");
    });
  });
};

const main = async () => {
  try {
    console.log("🔍 Starting Shopify product addition tool...\n");

    // Test Shopify API connection first
    const connectionResult = await testShopifyConnection();
    if (!connectionResult.success) {
      console.error("❌ Cannot proceed without a valid Shopify API connection.");
      console.error("Please check your .env file and ensure your credentials are correct.");
      process.exit(1);
    }

    console.log("\n📦 Loading product data from product.json...");
    const product = await loadProductData();
    console.log("✅ Product data loaded successfully.");

    const confirmed = await promptUserForConfirmation(product);

    if (confirmed) {
      console.log("\n🚀 Adding product to Shopify...");
      const result = await addProductToShopify(product);

      console.log("✅ Product addition completed successfully!");

      if (result?.data?.productCreate?.product?.id) {
        const productId = result.data.productCreate.product.id;
        const storeName = process.env.SHOPIFY_STORE_NAME;
        const adminProductUrl = `https://${storeName}.myshopify.com/admin/products/${productId.split("/").pop()}`;
        const publicProductUrl = `https://${storeName}.myshopify.com/products/${result.data.productCreate.product.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")}`;

        console.log(`🔗 Admin URL: ${adminProductUrl}`);
        console.log(`🌐 Public URL: ${publicProductUrl}`);
      } else {
        console.log("⚠️  Could not generate product URLs - check the API response for details");
        if (result?.data?.productCreate?.userErrors?.length > 0) {
          console.log("❌ Product creation errors:", result.data.productCreate.userErrors);
        }
      }
    } else {
      console.log("❌ Product addition cancelled by user.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

main();
