# Solienne - Shopify Product Addition Tool

A Node.js script that reads product data from a JSON file and adds new products to a Shopify store via the Shopify GraphQL API.

## Project Structure

```
solienne/
├── package.json
├── .env.example         # Environment variables template
├── src/
│   ├── product.json      # Product data file
│   └── addProduct.ts     # Main script
├── tsconfig.json
└── yarn.lock
```

## Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Configure Shopify credentials:

   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and replace the placeholder values with your actual Shopify credentials:
     - `SHOPIFY_STORE_NAME`: Your store name (without .myshopify.com)
     - `SHOPIFY_API_VERSION`: Shopify API version (e.g., `2023-10`)
     - `SHOPIFY_ACCESS_TOKEN`: Your Shopify access token

3. Customize product data:
   - Edit `src/product.json` with your product information

## Usage

Run the script to add a product to your Shopify store:

```bash
yarn start
```

The script will:

1. Test the Shopify API connection using your credentials
2. Load product data from `product.json`
3. Display the product details for confirmation
4. Prompt for user confirmation
5. Add the product to Shopify if confirmed

## Product Data Format

The `product.json` file should contain:

```json
{
  "title": "Product Title",
  "bodyHtml": "<strong>Product description with HTML.</strong>",
  "vendor": "Vendor Name",
  "productType": "Product Type",
  "tags": ["tag1", "tag2"],
  "variants": [
    {
      "price": "19.99",
      "sku": "SKU123",
      "inventoryQuantity": 100,
      "inventoryPolicy": "continue",
      "requiresShipping": true
    }
  ],
  "publishedAt": "2023-01-01T00:00:00Z",
  "images": [
    {
      "src": "https://example.com/product-image.jpg",
      "alt": "Product Image Description"
    }
  ]
}
```

## Features

- ✅ TypeScript support with proper type definitions
- ✅ Shopify API connection testing before proceeding
- ✅ Error handling for API calls and file operations
- ✅ User confirmation before adding products
- ✅ Detailed logging of API responses
- ✅ Support for product variants, tags, and inventory
- ✅ Product images with URL support

## Dependencies

- `node-fetch`: For making HTTP requests to Shopify API
- `typescript`: TypeScript compiler
- `ts-node`: Run TypeScript files directly
- `@types/node`: Node.js type definitions
- `@types/node-fetch`: Type definitions for node-fetch

## Notes

- Make sure your Shopify access token has the necessary permissions to create products
- The script uses the Shopify GraphQL Admin API
- All API responses and errors are logged to the console
