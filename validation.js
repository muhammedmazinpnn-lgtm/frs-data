document.getElementById("studentForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phoneInput = document.getElementById("phone").value.trim();
    const message = document.getElementById("message");

    message.innerText = "";

    // 🔹 Name Validation
    if (name === "") {
        message.style.color = "red";
        message.innerText = "Name is required";
        return;
    }

    // 🔹 Phone Validation (ONLY 10 digits)
    if (!/^[0-9]{10}$/.test(phoneInput)) {
        message.style.color = "red";
        message.innerText = "Phone must be exactly 10 digits";
        return;
    }

    // 🔹 Add +91 country code before saving
    const fullPhone = "91" + phoneInput;

    // 🔹 Check if already registered
    const { data: existingUser } = await client
        .from("students")
        .select("*")
        .eq("phone", fullPhone);

    if (existingUser && existingUser.length > 0) {
        message.style.color = "orange";
        message.innerText = "You are already registered!";
        return;
    }

    // 🔹 Insert if not exists
    const { error } = await client
        .from("students")
        .insert([{ name: name, phone: fullPhone }]);

    if (error) {
        message.style.color = "red";
        message.innerText = "Error: " + error.message;
    } else {
        message.style.color = "green";
        message.innerText = "Registration successful!";
        document.getElementById("studentForm").reset();
    }
});