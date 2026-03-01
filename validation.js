const { createClient } = supabase;
const client = createClient("https://hbzhwjnfvyacxahjmyxn.supabase.co", "sb_publishable_-w3EHUMrPeBJe7EMbwGuKQ_aZlcEmbE");
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("studentForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phoneInput = document.getElementById("phone").value.trim();
        const message = document.getElementById("message");

        message.innerText = "";
        message.style.color = "red";

        if (!name) {
            message.innerText = "Name is required";
            return;
        }

        if (!/^[0-9]{10}$/.test(phoneInput)) {
            message.innerText = "Phone must be exactly 10 digits";
            return;
        }

        const fullPhone = "91" + phoneInput;

        const { data: existingUser, error } = await client
            .from("students")
            .select("id")
            .eq("phone", fullPhone)
            .limit(1);

        if (error) {
            message.innerText = error.message;
            return;
        }

        if (existingUser.length > 0) {
            message.style.color = "orange";
            message.innerText = "You are already registered!";
            return;
        }

        const { error: insertError } = await client
            .from("students")
            .insert([{ name: name, phone: fullPhone }]);

        if (insertError) {
            message.innerText = insertError.message;
        } else {
            message.style.color = "green";
            message.innerText = "Registration successful!";
            form.reset();
        }
    });

});