using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meetings.Database.Migrations
{
    /// <inheritdoc />
    public partial class adduserLastActivity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "Users",
                newName: "IsConfirmed");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastActiveDate",
                table: "Users",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastActiveDate",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "IsConfirmed",
                table: "Users",
                newName: "IsActive");
        }
    }
}
