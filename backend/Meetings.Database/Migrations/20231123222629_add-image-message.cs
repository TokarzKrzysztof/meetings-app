using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meetings.Database.Migrations
{
    /// <inheritdoc />
    public partial class addimagemessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Text",
                table: "Messages",
                newName: "Value");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Messages",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "Value",
                table: "Messages",
                newName: "Text");
        }
    }
}
