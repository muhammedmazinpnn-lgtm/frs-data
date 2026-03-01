document.getElementById("studentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phoneInput = document.getElementById("phone").value.trim();
    const message = document.getElementById("message");

    message.innerText = "";
    message.style.color = "red";

    try {
        // 🔹 Name Validation
        if (!name) {
            message.innerText = "Name is required";
            return;
        }

        // 🔹 Phone Validation (exactly 10 digits)
        if (!/^[0-9]{10}$/.test(phoneInput)) {
            message.innerText = "Phone must be exactly 10 digits";
            return;
        }

        // Add country code
        const fullPhone = "91" + phoneInput;

        // 🔹 Check if already registered (case insensitive name)
        const { data: existingUser, error: checkError } = await client
            .from("students")
            .select("id")
            .ilike("name", name)
            .eq("phone", fullPhone)
            .limit(1);

        if (checkError) {
            throw checkError;
        }

        if (existingUser.length > 0) {
            message.style.color = "orange";
            message.innerText = "You are already registered!";
            return;
        }

        // 🔹 Insert new record
        const { error: insertError } = await client
            .from("students")
            .insert([{ name: name, phone: fullPhone }]);

        if (insertError) {
            throw insertError;
        }

        message.style.color = "green";
        message.innerText = "Registration successful!";
        document.getElementById("studentForm").reset();

    } catch (err) {
        message.style.color = "red";
        message.innerText = "Error: " + err.message;
        console.error(err);
    }
});