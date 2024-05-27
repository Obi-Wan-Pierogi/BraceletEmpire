using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BraceletEmpire.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePricePrecisionRemoveBraceletId1Column : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bracelets_Bracelets_BraceletId1",
                table: "Bracelets");

            migrationBuilder.DropIndex(
                name: "IX_Bracelets_BraceletId1",
                table: "Bracelets");

            migrationBuilder.DropColumn(
                name: "BraceletId1",
                table: "Bracelets");

            migrationBuilder.CreateIndex(
                name: "IX_Bracelets_ItemId",
                table: "Bracelets",
                column: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bracelets_Items_ItemId",
                table: "Bracelets",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bracelets_Items_ItemId",
                table: "Bracelets");

            migrationBuilder.DropIndex(
                name: "IX_Bracelets_ItemId",
                table: "Bracelets");

            migrationBuilder.AddColumn<int>(
                name: "BraceletId1",
                table: "Bracelets",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bracelets_BraceletId1",
                table: "Bracelets",
                column: "BraceletId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Bracelets_Bracelets_BraceletId1",
                table: "Bracelets",
                column: "BraceletId1",
                principalTable: "Bracelets",
                principalColumn: "BraceletId");
        }
    }
}
