const { createClient } = supabase;

const client = createClient(
    "https://hbzhwjnfvyacxahjmyxn.supabase.co",
    "sb_publishable_-w3EHUMrPeBJe7EMbwGuKQ_aZlcEmbE"
);

function resetButton(btn) {
    btn.disabled = false;
    btn.innerText = "Register";
}

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("studentForm");

    form.addEventListener("submit", function (e) {
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

        // Check if phone already exists
        client
            .from("frs")
            .select("id")
            .eq("phone", phone)
            .limit(1)
            .then(function (res) {
                if (res.error) {
                    message.innerText = "Error: " + res.error.message;
                    resetButton(btn);
                    return;
                }

                if (res.data && res.data.length > 0) {
                    message.style.color = "orange";
                    message.innerText = "You are already registered!";
                    resetButton(btn);
                    return;
                }

                // Insert into frs table
                client
                    .from("frs")
                    .insert([{ name: name, phone: phone }])
                    .then(function (insertRes) {
                        if (insertRes.error) {
                            message.style.color = "red";
                            message.innerText = "Error: " + insertRes.error.message;
                        } else {
                            message.style.color = "green";
                            message.innerText = "Registration successful!";
                            form.reset();
                        }
                        resetButton(btn);
                    })
                    .catch(function (err) {
                        message.style.color = "red";
                        message.innerText = "Error: " + err.message;
                        resetButton(btn);
                    });
            })
            .catch(function (err) {
                message.style.color = "red";
                message.innerText = "Error: " + err.message;
                resetButton(btn);
            });
    });

});