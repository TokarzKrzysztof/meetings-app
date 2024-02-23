using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meetings.Database.Migrations
{
    /// <inheritdoc />
    public partial class changeinterestscolumnname : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "UserProfiles");

            migrationBuilder.RenameColumn(
                name: "Interests",
                table: "UserProfiles",
                newName: "InterestsIds");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InterestsIds",
                table: "UserProfiles",
                newName: "Interests");

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "UserProfiles",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
