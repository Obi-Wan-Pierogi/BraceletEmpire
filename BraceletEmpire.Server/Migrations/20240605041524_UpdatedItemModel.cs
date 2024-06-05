using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BraceletEmpire.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedItemModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Items",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Items");
        }
    }
}
