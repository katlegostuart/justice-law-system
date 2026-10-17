using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JusticeLaw.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAttorneyTierAndCapacity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                table: "Attorneys",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Tier",
                table: "Attorneys",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "Attorneys");

            migrationBuilder.DropColumn(
                name: "Tier",
                table: "Attorneys");
        }
    }
}
