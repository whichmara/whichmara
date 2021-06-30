// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDVrPo_yUoEgEp0UohI9QKNNtRvYtyqKME",
    authDomain: "whichmara-2efeb.firebaseapp.com",
    projectId: "whichmara-2efeb",
    databaseURL: "https://whichmara-2efeb-default-rtdb.europe-west1.firebasedatabase.app/",
    storageBucket: "whichmara-2efeb.appspot.com",
    messagingSenderId: "368953737158",
    appId: "1:368953737158:web:1b1399a62e64a6cb053cc7",
    measurementId: "G-9TJLMD4XQG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
///db.collection("votes").add({2: 1});

const maras = 16;
const jpgs = [7, 8, 12, 13];

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

const names = ['GODZILLA', ' MASTER CHEF', 'PE BOABA', 'SUPI', 'COIOASA', 'TOMATO', 'DEPRESSED', 'CAP DE OU', 'BOMBARDIERA', 'WIDE', 'ODOBASIAN', 'JUDGY', "MLEM", "SOBI", "HOT GIRL SUMMER", "THE IMPOSTOR"]

const mprog = 60;

const container = document.getElementById("mara")
for (let i = 1; i <= maras; i++)
{
    let card = document.createElement("div");
    card.className = "card";
    let flex = document.createElement("div");
    flex.className = 'flex';
    let desc = document.createElement("h4");
    desc.className = "desc";
    desc.textContent = names[i-1];
    let pic = document.createElement("div");
    pic.className = "pic"
    let img = document.createElement("img");
    img.src = `/res/${i}.${jpgs.includes(i) ? "jpg" : "png"}`;
    let counter = document.createElement("h2");
    counter.textContent = 0;

    //progressbar
    let bar = document.createElement('div');
    bar.className = 'rainbow';
    bar.style.opacity = .4;
    bar.style.display = 'flex';
    bar.style.flexDirection = 'column';
    for (let color of colors)
    {
        let col = document.createElement('div');
        col.style.backgroundColor = color;
        col.style.width = '100%';
        col.style.height = '100%';
        bar.appendChild(col);
    }
    pic.appendChild(img);
    flex.appendChild(counter);
    flex.appendChild(pic);
    flex.appendChild(desc);
    card.appendChild(bar);
    card.appendChild(flex);
    container.appendChild(card);

    card.addEventListener("click", async () =>
    {
        if (document.cookie)
        {
            document.getElementById("voted").className = "";
            return;
        }
        let snapshot = await db.collection("votes").doc("votes").get()
        db.collection("votes").doc("votes").set({...snapshot.data(), ...{[i]: (snapshot.data()[i] || 0) + 1}});
        snapshot = await db.collection("votes").doc("votes").get()

        //create cookie
        var timeToAdd = 1000 * 60 * 60 * 24 * 1; // expire after 1 day
        var date = new Date();
        var expiryTime = parseInt(date.getTime()) + timeToAdd;
        date.setTime(expiryTime);
        var utcTime = date.toUTCString();
        document.cookie = `voted; expires=${utcTime};`

        update();

    })
}

async function update()
{
    let snapshot = await db.collection("votes").doc("votes").get();
    let total = 0;
    for (let vote in snapshot.data())
    {
        total += snapshot.data()[vote];
    }
    //console.log(total);
    for (let i = 1; i <= maras; i++)
    {
        let card = container.children[i-1];
        let value = snapshot.data()[i] || 0
        card.children[1].children[0].textContent = value;
        for (let j = 0; j < 6; j++)
        {
            card.children[0].children[j].style.width = `${15 + (value / total) * mprog}vw`;
        }
    }
}

window.onload = async () => {await update()}

db.collection("votes").onSnapshot(async () => 
    {
        await update();
    })