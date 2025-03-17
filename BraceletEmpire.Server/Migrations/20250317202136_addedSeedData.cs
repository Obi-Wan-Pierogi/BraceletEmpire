using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BraceletEmpire.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Items",
                columns: new[] { "ItemId", "BraceletSpecificAttribute", "ImageUrl", "ItemDescription", "ItemName", "ItemPrice", "ItemType", "OrderId", "Quantity" },
                values: new object[,]
                {
                    { 1, "Glass beads", "https://placehold.co/600x400/pink/white?text=Beaded+Bracelet", "Handmade bracelet with colorful beads, perfect for summer!", "Colorful Beaded Bracelet", 12.99m, "Bracelet", null, 10 },
                    { 2, "Cotton thread", "https://placehold.co/600x400/purple/white?text=Friendship+Bracelet", "Handwoven friendship bracelet made with embroidery thread", "Friendship Bracelet", 8.99m, "Bracelet", null, 15 }
                });

            migrationBuilder.InsertData(
                table: "Items",
                columns: new[] { "ItemId", "ImageUrl", "ItemDescription", "ItemName", "ItemPrice", "ItemType", "KeychainSpecificAttribute", "OrderId", "Quantity" },
                values: new object[,]
                {
                    { 3, "https://placehold.co/600x400/purple/white?text=Name+Keychain", "Personalized keychain with your name in colorful beads", "Custom Name Keychain", 9.99m, "Keychain", "Acrylic beads", null, 8 },
                    { 4, "https://placehold.co/600x400/blue/white?text=Resin+Flower", "Beautiful keychain with real flowers preserved in resin", "Resin Flower Keychain", 14.99m, "Keychain", "Epoxy resin", null, 5 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "ItemId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "ItemId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "ItemId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "ItemId",
                keyValue: 4);
        }
    }
}
