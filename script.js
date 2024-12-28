const nameInput = document.getElementById("name");
const phoneNumber = document.getElementById("phoneNumber");
const addBtn = document.getElementById("add-btn");
const contactsList = document.getElementById("contacts");
const saveBtn = document.getElementById("ok")
let users;

async function getUsers() {
    const javob = await fetch("https://676a7d81863eaa5ac0de8dec.mockapi.io/api/v123/users");
    users = await javob.json();
    usersView(users); 
}
getUsers();


function usersView(data) {
    contactsList.innerHTML = "";
    data.forEach(user => {
        const li = document.createElement("li");
        li.setAttribute("data-id", user.id);
        li.innerHTML = `
          <i class="fa-solid fa-user"></i>
          <div class="list">
              <div>
                  <h2>Name: ${user.name}</h2>
                  <p>${user.phoneNumber}/${user.name}</p>
              </div>
              <div class="btn-box">
                  <button id="edit-btn" onClick="editUser(this)"><i class="fa-solid fa-pen-to-square"></i></button>
                  <button id="delete-btn" onclick="deleteContact(${user.id})"><i class="fa-solid fa-trash"></i></button>
              </div>
          </div>
        `;
        contactsList.appendChild(li);
    });
}

addBtn.addEventListener("click", () => {

    if (nameInput.value.trim().length < 1 || phoneNumber.value.trim().length < 1) {

        alert("Iltimos, ism va telefon raqamini kiriting!");

    }
     else {

        addContact(nameInput.value, phoneNumber.value);

    }


});




async function addContact(ism, tel) {
    const response = await fetch("https://676a7d81863eaa5ac0de8dec.mockapi.io/api/v123/users", {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: ism,
            phoneNumber: tel,
        })


    });



    if (response.ok) {
        nameInput.value = "";
        phoneNumber.value = "";
        getUsers();
    } else {
        alert("Xatolik yuz berdi, qayta urinib ko'ring!");
    }
}




async function deleteContact(id) {
    const response = await fetch(`https://676a7d81863eaa5ac0de8dec.mockapi.io/api/v123/users/${id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        getUsers();
    } else {
        alert("O'chirishda xatolik yuz berdi!");
    }
}


async function editUser(e) {
    const id = e.parentNode.parentNode.parentNode.getAttribute("data-id");
  const name = e.parentNode.parentNode.querySelector("h2").textContent.split(":")[1];
  const tel = e.parentNode.parentNode.querySelector("p").textContent.split("/")[0];
   
    nameInput.value=name;
    phoneNumber.value=tel;

    addBtn.style.display="none";
    saveBtn.style.display="block";
    saveBtn.addEventListener("click", async()=>{
        try {
            const response = await fetch(
                `https://676a7d81863eaa5ac0de8dec.mockapi.io/api/v123/users/${id}`,
                {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: nameInput.value,
                        phoneNumber: +phoneNumber.value
                    })
                }
            );
            nameInput.value="";
            phoneNumber.value="";
            addBtn.style.display="block";
            saveBtn.style.display="none";
            getUsers();
        } catch (error) {
            console.log(error);
        }
    })
}


