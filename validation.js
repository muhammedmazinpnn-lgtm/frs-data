const { createClient } = supabase;

const client = createClient(
    "https://hbzhwjnfvyacxahjmyxn.supabase.co",
    "sb_publishable_-w3EHUMrPeBJe7EMbwGuKQ_aZlcEmbE"
);

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("studentForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message");
        const btn = form.querySelector("button");

        message.innerText = "";
        message.style.color = "red";

        // Name validation
        if (!name) {
            message.innerText = "Name is required";
            return;
        }

        // Phone validation (10 digits only)
        if (!/^[0-9]{10}$/.test(phone)) {
            message.innerText = "Phone must be exactly 10 digits";
            return;
        }

        // Show loading state
        btn.disabled = true;
        btn.innerText = "Registering...";

        try {

            // Check if phone already exists
            const { data: existingUser, error: checkError } = await client
                .from("frs")
                .select("id")
                .eq("phone", phone)
                .limit(1);

            if (checkError) throw checkError;

            if (existingUser && existingUser.length > 0) {
                message.style.color = "orange";
                message.innerText = "You are already registered!";
                return;
            }

            // Insert into frs table
            const { error: insertError } = await client
                .from("frs")
                .insert([{ name: name, phone: phone }]);

            if (insertError) throw insertError;

            message.style.color = "green";
            message.innerText = "Registration successful!";
            form.reset();

        } catch (err) {
            message.style.color = "red";
            message.innerText = "Error: " + err.message;
            console.error(err);
        } finally {
            // Always re-enable button
            btn.disabled = false;
            btn.innerText = "Register";
        }
    });

});
