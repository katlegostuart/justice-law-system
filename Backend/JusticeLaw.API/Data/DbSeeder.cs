using Microsoft.AspNetCore.Identity;

namespace JusticeLaw.API.Data
{
    // Only creates what the system cannot work without: the roles and the first Admin login.
    // Sample data (clients, attorneys, cases ...) is inserted with DummyData.sql instead.
    public static class DbSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
            var configuration = services.GetRequiredService<IConfiguration>();

            // 1. Roles
            foreach (var role in new[] { "Admin", "Attorney", "Client" })
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // 2. First Admin login (email and password come from appsettings.json)
            var email = configuration["SeedAdmin:Email"];
            var password = configuration["SeedAdmin:Password"];

            if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(password)
                && await userManager.FindByEmailAsync(email) == null)
            {
                var admin = new IdentityUser { UserName = email, Email = email, EmailConfirmed = true };
                var result = await userManager.CreateAsync(admin, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }
        }
    }
}
