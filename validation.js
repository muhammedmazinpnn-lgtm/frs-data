// 🔹 Replace with your real values
const supabaseUrl = "https://hbzhwjnfvyacxahjmyxn.supabase.co";
const supabaseKey = "sb_publishable_-w3EHUMrPeBJe7EMbwGuKQ_aZlcEmbE";

const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);

document.getElementById("studentForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message");

    // 🔹 JS VALIDATION
    if (name === "") {
        message.style.color = "red";
        message.innerText = "Name is required";
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        message.style.color = "red";
        message.innerText = "Phone must be exactly 10 digits";
        return;
    }

    // 🔹 Insert into Supabase
    const { error } = await client
        .from("students")
        .insert([{ name: name, phone: phone }]);

    if (error) {
        message.style.color = "red";
        message.innerText = "Error: " + error.message;
    } else {
        message.style.color = "green";
        message.innerText = "Student Registered Successfully!";
        document.getElementById("studentForm").reset();
    }
});