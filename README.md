# Solienne - Shopify Product Addition Tool

A Node.js script that reads product data from a JSON file and adds new products to a Shopify store via the Shopify GraphQL API. Perfect for bulk product creation, limited edition releases, and automated inventory management.

## 🚀 Features

- ✅ **TypeScript Support** - Full type safety with proper interfaces
- ✅ **API Connection Testing** - Validates credentials before proceeding
- ✅ **Image Upload** - Supports product images from URLs
- ✅ **Inventory Management** - Handles variants, SKUs, and stock levels
- ✅ **User Confirmation** - Preview and confirm before creating products
- ✅ **Error Handling** - Comprehensive error messages and debugging
- ✅ **Product URLs** - Returns direct links to admin and public product pages
- ✅ **Environment Variables** - Secure credential management

## 📁 Project Structure

```
solienne/
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── README.md            # This file
├── tsconfig.json        # TypeScript configuration
├── yarn.lock            # Dependency lock file
└── src/
    ├── product.json     # Product data file (customize this)
    └── addProduct.ts    # Main script
```

## 🛠️ Setup

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Shopify store with API access

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/gitpancake/eden.shopify.git
   cd eden.shopify
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Configure Shopify credentials:**

   - Copy `.env.example` to `.env`:

     ```bash
     cp .env.example .env
     ```

   - Edit `.env` and replace the placeholder values:

     ```env
     SHOPIFY_STORE_NAME=your-store-name
     SHOPIFY_API_VERSION=2023-10
     SHOPIFY_ACCESS_TOKEN=your-access-token
     DEBUG=false
     ```

4. **Customize product data:**
   - Edit `src/product.json` with your product information

## 🚀 Usage

### Basic Usage

Run the script to add a product to your Shopify store:

```bash
yarn start
```

### What the Script Does

1. **🔍 Connection Test** - Validates your Shopify API credentials
2. **📦 Data Loading** - Reads product data from `product.json`
3. **👀 Preview** - Displays all product details for review
4. **✅ Confirmation** - Prompts for user confirmation
5. **🚀 Creation** - Creates the product in Shopify
6. **🖼️ Image Upload** - Adds product images from URLs
7. **💰 Variant Update** - Sets pricing, SKU, and inventory
8. **🔗 URL Return** - Provides admin and public product URLs

### Example Output

```
🔍 Starting Shopify product addition tool...

Testing Shopify API connection...
✅ Successfully connected to Shopify store: SOLIENNE

📦 Loading product data from product.json...
✅ Product data loaded successfully.

Product to be added:
Title: Threshold Mirror #1 - Digital Consciousness Portrait
Vendor: SOLIENNE
Type: Digital Art Print
Price: $850.00
SKU: SOL-TM001-1620
Inventory: 25
Tags: solienne, digital-consciousness, emotional-archaeology
Images: 1 image(s)
   Image 1: https://example.com/product-image.png

Do you want to add this product to Shopify? (yes/no): yes

🚀 Adding product to Shopify...
Creating product...
✅ Product created successfully: Threshold Mirror #1 - Digital Consciousness Portrait
🖼️  Adding images...
✅ Image added successfully
Updating variant with custom data...
✅ Variant updated successfully
✅ Product addition completed successfully!
🔗 Admin URL: https://your-store.myshopify.com/admin/products/123456789
🌐 Public URL: https://your-store.myshopify.com/products/threshold-mirror-1-digital-consciousness-portrait
```

## 📋 Product Data Format

The `product.json` file contains all the product information. Here's the complete structure:

```json
{
  "title": "Product Title",
  "bodyHtml": "<strong>Product description with HTML.</strong>",
  "vendor": "Vendor Name",
  "productType": "Product Type",
  "tags": ["tag1", "tag2"],
  "variants": [
    {
      "price": "850.00",
      "sku": "SKU123",
      "inventoryQuantity": 25,
      "inventoryPolicy": "continue",
      "requiresShipping": true,
      "title": "16\" x 20\" Archival Print",
      "weight": 0.5,
      "weightUnit": "lb"
    }
  ],
  "publishedAt": "2025-01-15T00:00:00Z",
  "images": [
    {
      "src": "https://example.com/product-image.jpg",
      "alt": "Product Image Description"
    }
  ],
  "options": [
    {
      "name": "Size",
      "values": ["16\" x 20\""]
    }
  ]
}
```

### Field Descriptions

| Field         | Type   | Required | Description                          |
| ------------- | ------ | -------- | ------------------------------------ |
| `title`       | string | ✅       | Product title                        |
| `bodyHtml`    | string | ✅       | Product description (supports HTML)  |
| `vendor`      | string | ✅       | Product vendor/brand                 |
| `productType` | string | ✅       | Product category/type                |
| `tags`        | array  | ✅       | Product tags for organization        |
| `variants`    | array  | ✅       | Product variants (size, color, etc.) |
| `publishedAt` | string | ✅       | Publication date (ISO format)        |
| `images`      | array  | ❌       | Product images (URLs)                |
| `options`     | array  | ❌       | Product options (size, color, etc.)  |

### Variant Fields

| Field               | Type    | Required | Description                        |
| ------------------- | ------- | -------- | ---------------------------------- |
| `price`             | string  | ✅       | Product price                      |
| `sku`               | string  | ✅       | Stock keeping unit                 |
| `inventoryQuantity` | number  | ✅       | Available inventory                |
| `inventoryPolicy`   | string  | ✅       | `"continue"` or `"deny"`           |
| `requiresShipping`  | boolean | ✅       | Whether shipping is required       |
| `title`             | string  | ❌       | Variant title                      |
| `weight`            | number  | ❌       | Product weight                     |
| `weightUnit`        | string  | ❌       | Weight unit (`"lb"`, `"kg"`, etc.) |

## 🔧 Configuration

### Environment Variables

| Variable               | Description                              | Example           |
| ---------------------- | ---------------------------------------- | ----------------- |
| `SHOPIFY_STORE_NAME`   | Your store name (without .myshopify.com) | `my-store`        |
| `SHOPIFY_API_VERSION`  | Shopify API version                      | `2023-10`         |
| `SHOPIFY_ACCESS_TOKEN` | Your Shopify access token                | `shpat_...`       |
| `DEBUG`                | Enable debug logging                     | `true` or `false` |

### Shopify API Permissions

Your access token needs the following permissions:

- `read_products` - Read existing products
- `write_products` - Create and update products
- `read_inventory` - Read inventory levels
- `write_inventory` - Update inventory levels

## 📦 Dependencies

### Production Dependencies

- `node-fetch` - HTTP requests to Shopify API
- `dotenv` - Environment variable management

### Development Dependencies

- `typescript` - TypeScript compiler
- `ts-node` - Run TypeScript files directly
- `@types/node` - Node.js type definitions
- `@types/node-fetch` - Type definitions for node-fetch
- `nodemon` - Development server with auto-reload

## 📝 Notes

### Important Considerations

- **API Permissions**: Ensure your Shopify access token has the necessary permissions
- **Image Processing**: Shopify processes images asynchronously - they may take a few minutes to appear
- **Inventory Policy**: Use `"continue"` for limited editions, `"deny"` to stop sales when inventory is low
- **API Limits**: Be mindful of Shopify's API rate limits

### Troubleshooting

- **Connection Issues**: Check your `.env` file and API credentials
- **Image Upload Failures**: Ensure image URLs are publicly accessible
- **GraphQL Errors**: Check the console output for detailed error messages

### Development

- **Debug Mode**: Set `DEBUG=true` in your `.env` file for detailed logging
- **Auto-reload**: Use `yarn dev` for development with auto-reload
- **Build**: Use `yarn build` to compile TypeScript to JavaScript

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
