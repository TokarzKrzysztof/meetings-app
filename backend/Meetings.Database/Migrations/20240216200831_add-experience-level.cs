using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Meetings.Database.Migrations
{
    /// <inheritdoc />
    public partial class addexperiencelevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasExperienceLevel",
                table: "Categories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("1bd18285-1050-46f2-96c2-05df35c56a9c"),
                column: "HasExperienceLevel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("26312a46-3e5f-453e-934c-da909d6dfe19"),
                column: "HasExperienceLevel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("2b4793ab-5bd8-4611-a49b-0bcda4194f9d"),
                column: "HasExperienceLevel",
                value: false);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("319e9fa3-c8b3-45b7-b1fa-d56ca4fd7969"),
                column: "HasExperienceLevel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("35cda0d4-6be0-49c8-8655-44a057618318"),
                column: "HasExperienceLevel",
                value: false);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("889f1a69-6bf0-4b08-b0c7-3d9f73a82dd2"),
                column: "HasExperienceLevel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("975fcaef-e0f6-48e0-b6c0-809adcb8e4b4"),
                column: "HasExperienceLevel",
                value: false);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("9d0e7e0d-b8e7-4adb-b1cd-15f34e506d61"),
                column: "HasExperienceLevel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("a2037c34-53fa-444f-9a80-252839a25bbd"),
                column: "HasExperienceLevel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("b6f5cf4f-2008-45a9-acb8-0857b1a9190b"),
                column: "HasExperienceLevel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("dc7a3995-c967-4ff9-9e90-3abee528bf66"),
                column: "HasExperienceLevel",
                value: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("fd6cc017-d0ae-45ee-9548-a654ef50aa5d"),
                column: "HasExperienceLevel",
                value: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasExperienceLevel",
                table: "Categories");
        }
    }
}
