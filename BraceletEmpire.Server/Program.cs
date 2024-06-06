//using Microsoft.AspNetCore.Identity;
//using Microsoft.EntityFrameworkCore;
//using BraceletEmpire.Server.Data;
//using BraceletEmpire.Server.Areas.Identity.Data;
//using System.Text.Json.Serialization;

//var builder = WebApplication.CreateBuilder(args);
//var connectionString = builder.Configuration.GetConnectionString("BraceletEmpireServerContextConnection") ?? throw new InvalidOperationException("Connection string 'BraceletEmpireServerContextConnection' not found.");

//builder.Services.AddDbContext<BraceletEmpireServerContext>(options => options.UseSqlServer(connectionString));

//builder.Services.AddDefaultIdentity<BraceletEmpireServerUser>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<BraceletEmpireServerContext>();

//// Add services to the container.

//builder.Services.AddControllers().AddJsonOptions(options =>
//options.JsonSerializerOptions.
//ReferenceHandler = ReferenceHandler.IgnoreCycles);

//// Add CORS setup
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowSpecificOrigin",
//        builder => builder.WithOrigins("https://localhost:4200")
//                          .AllowAnyMethod()
//                          .AllowAnyHeader());
//});


//// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//var app = builder.Build();

//app.UseDefaultFiles();
//app.UseStaticFiles();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();

//app.UseAuthorization();

//// Apply CORS policy
//app.UseCors("AllowSpecificOrigin");

//app.MapControllers();

//app.MapFallbackToFile("/index.html");

//app.Run();

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using BraceletEmpire.Server.Data;
using BraceletEmpire.Server.Areas.Identity.Data;
using BraceletEmpire.Server.Services; // Make sure to include this namespace
using System.Text.Json.Serialization;
using BraceletEmpire.Server.Models;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("BraceletEmpireServerContextConnection") ?? throw new InvalidOperationException("Connection string 'BraceletEmpireServerContextConnection' not found.");

builder.Services.AddDbContext<BraceletEmpireServerContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddDefaultIdentity<BraceletEmpireServerUser>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<BraceletEmpireServerContext>();

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// Register EmailService
builder.Services.AddScoped<IEmailService, EmailService>();

// Configure SMTP settings
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));


// Add CORS setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("https://localhost:4200")
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Apply CORS policy
app.UseCors("AllowSpecificOrigin");

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
