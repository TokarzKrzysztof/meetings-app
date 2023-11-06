using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meetings.Database.Migrations
{
    public partial class fixbuguniqueauthorId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MessageReactions_AuthorId",
                table: "MessageReactions");

            migrationBuilder.CreateIndex(
                name: "IX_MessageReactions_AuthorId",
                table: "MessageReactions",
                column: "AuthorId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MessageReactions_AuthorId",
                table: "MessageReactions");

            migrationBuilder.CreateIndex(
                name: "IX_MessageReactions_AuthorId",
                table: "MessageReactions",
                column: "AuthorId",
                unique: true);
        }
    }
}
