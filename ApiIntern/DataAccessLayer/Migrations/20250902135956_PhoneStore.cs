using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class PhoneStore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Brands",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brands", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    IsAdmin = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Phones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    BrandId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Phones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Phones_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Brands",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Samsung brand description", "Samsung" },
                    { 2, "Apple brand description", "Apple" },
                    { 3, "Tecno brand description", "Tecno" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "IsAdmin", "PasswordHash", "Username" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), true, "100000.epkDlhQDSuyG76bjVBNXAA==.pXviqxKRvOWbCDkSY59AwDhKnsYBhnOBrdLqfz4bebg=", "admin" });

            migrationBuilder.InsertData(
                table: "Phones",
                columns: new[] { "Id", "BrandId", "Description", "ImageUrl", "Name", "Price" },
                values: new object[,]
                {
                    { 1, 1, "Samsung phone description", "https://example.com/samsung.jpg", "Samsung Galaxy S1", 800m },
                    { 2, 1, "Samsung phone description", "https://example.com/samsung.jpg", "Samsung Galaxy S2", 801m },
                    { 3, 1, "Samsung phone description", "https://example.com/samsung.jpg", "Samsung Galaxy S3", 802m },
                    { 4, 1, "Samsung phone description", "https://example.com/samsung.jpg", "Samsung Galaxy S4", 803m },
                    { 5, 1, "Samsung phone description", "https://example.com/samsung.jpg", "Samsung Galaxy S5", 804m },
                    { 6, 1, "Samsung phone description", "https://example.com/samsung.jpg", "Samsung Galaxy S6", 805m },
                    { 7, 2, "Apple phone description", "https://example.com/apple.jpg", "iPhone 1", 1006m },
                    { 8, 2, "Apple phone description", "https://example.com/apple.jpg", "iPhone 2", 1007m },
                    { 9, 2, "Apple phone description", "https://example.com/apple.jpg", "iPhone 3", 1008m },
                    { 10, 2, "Apple phone description", "https://example.com/apple.jpg", "iPhone 4", 1009m },
                    { 11, 2, "Apple phone description", "https://example.com/apple.jpg", "iPhone 5", 1010m },
                    { 12, 2, "Apple phone description", "https://example.com/apple.jpg", "iPhone 6", 1011m },
                    { 13, 3, "Tecno phone description", "https://example.com/tecno.jpg", "Tecno Spark 1", 312m },
                    { 14, 3, "Tecno phone description", "https://example.com/tecno.jpg", "Tecno Spark 2", 313m },
                    { 15, 3, "Tecno phone description", "https://example.com/tecno.jpg", "Tecno Spark 3", 314m },
                    { 16, 3, "Tecno phone description", "https://example.com/tecno.jpg", "Tecno Spark 4", 315m },
                    { 17, 3, "Tecno phone description", "https://example.com/tecno.jpg", "Tecno Spark 5", 316m },
                    { 18, 3, "Tecno phone description", "https://example.com/tecno.jpg", "Tecno Spark 6", 317m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Phones_BrandId",
                table: "Phones",
                column: "BrandId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Phones");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Brands");
        }
    }
}
