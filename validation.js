document.getElementById("studentForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message");

    message.innerText = "";

    // 🔹 Validation
    if (name === "") {
        message.style.color = "red";
        message.innerText = "Name is required";
        return;
    }

    if (!/^[0-9]{12}$/.test(phone)) {
        message.style.color = "red";
        message.innerText = "Phone must be exactly 12 digits";
        return;
    }

    // 🔹 Check if already registered
    const { data: existingUser } = await client
        .from("students")
        .select("*")
        .eq("phone", phone);

    if (existingUser && existingUser.length > 0) {
        message.style.color = "orange";
        message.innerText = "You are already registered!";
        return;
    }

    // 🔹 Insert if not exists
    const { error } = await client
        .from("students")
        .insert([{ name: name, phone: phone }]);

    if (error) {
        message.style.color = "red";
        message.innerText = "Error: " + error.message;
    } else {
        message.style.color = "green";
        message.innerText = "Registration successful!";
        document.getElementById("studentForm").reset();
    }
});