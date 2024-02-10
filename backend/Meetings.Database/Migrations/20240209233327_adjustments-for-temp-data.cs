using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meetings.Database.Migrations
{
    /// <inheritdoc />
    public partial class adjustmentsfortempdata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Data",
                table: "TempDatas");

            migrationBuilder.AddColumn<string>(
                name: "Data1",
                table: "TempDatas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Data2",
                table: "TempDatas",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Data1",
                table: "TempDatas");

            migrationBuilder.DropColumn(
                name: "Data2",
                table: "TempDatas");

            migrationBuilder.AddColumn<string>(
                name: "Data",
                table: "TempDatas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
