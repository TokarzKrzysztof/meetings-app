using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meetings.Database.Migrations
{
    public partial class addmessagereplytoid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ReplyToId",
                table: "Messages",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ReplyToId",
                table: "Messages",
                column: "ReplyToId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Messages_ReplyToId",
                table: "Messages",
                column: "ReplyToId",
                principalTable: "Messages",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Messages_ReplyToId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_ReplyToId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "ReplyToId",
                table: "Messages");
        }
    }
}
