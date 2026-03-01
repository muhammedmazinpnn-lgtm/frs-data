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

    // 🔹 Phone Validation (10 digits only)
    if (!/^[0-9]{10}$/.test(phoneInput)) {
        message.style.color = "red";
        message.innerText = "Phone must be exactly 10 digits";
        return;
    }

    // Add country code
    const fullPhone = "91" + phoneInput;

    // 🔹 Check if BOTH name and phone already exist
    const { data: existingUser, error: checkError } = await client
        .from("students")
        .select("*")
        .eq("name", name)
        .eq("phone", fullPhone);

    if (checkError) {
        message.style.color = "red";
        message.innerText = "Error checking registration";
        return;
    }

    if (existingUser && existingUser.length > 0) {
        message.style.color = "orange";
        message.innerText = "You are already registered!";
        return;
    }

    // 🔹 Insert new record
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