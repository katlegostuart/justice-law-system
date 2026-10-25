using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JusticeLaw.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TaskNumber",
                table: "LegalTasks",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql(@"
               WITH numbered AS (
                   SELECT TaskNumber,
                          ROW_NUMBER() OVER (ORDER BY DueDate, Id) AS rn
                   FROM LegalTasks
               )
               UPDATE numbered
               SET TaskNumber = 'TSK-' + RIGHT('000' + CAST(rn AS varchar(10)), 3);
           ");

            migrationBuilder.CreateIndex(
                name: "IX_LegalTasks_TaskNumber",
                table: "LegalTasks",
                column: "TaskNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LegalTasks_TaskNumber",
                table: "LegalTasks");

            migrationBuilder.DropColumn(
                name: "TaskNumber",
                table: "LegalTasks");
        }
    }
}
