using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meetings.Database.Migrations
{
    public partial class addannouncementstatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Announcements",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Announcements");
        }
    }
}
