const bandList = document.getElementById('bandlist');
const form = document.getElementById('addMember');

// getData();
async function getData() {
    let snapshot = await db.collection('band').get()
    let array = [];
    snapshot.docs.forEach(doc => {
        let e = doc.data();
        e.id = doc.id;
        array.push(e);
    })
    array.sort(function(a, b) {
        let aTime = a.time.substring(11, 23).split(':');
        let bTime = b.time.substring(11, 23).split(':');
        let aSecounds = parseInt(aTime[0] * 60 * 60) + parseInt(aTime[1] * 60) + parseFloat(aTime[2])
        let bSecounds = parseInt(bTime[0] * 60 * 60) + parseInt(bTime[1] * 60) + parseFloat(bTime[2])
        return bSecounds - aSecounds;
    });
    console.log(array)
    array.forEach(doc => {
        renderData(doc);
    })
}

function renderData(doc, id) {
    bandList.innerHTML += `
    <div data-id="${id}" style="background-color:lightgrey;margin:10px;width:250px">
    Name: ${doc.name}
    <div onclick="removeDiv(this)" style="float:right">X</div>
    <br>
    comment: ${doc.comment}
    <br><br>
    </div>
    `;
    // let cross = document.getElementById('cross')
    // console.log(cross)
    // cross.addEventListener('click', e => {
    //     console.log(e.target)
    //     // db.collection('band').doc(id).delete();
    // })
}
function removeDiv(e) {
    let parentId = e.parentElement.getAttribute('data-id')
    db.collection('band').doc(parentId).delete();
    
}
    // document.getElementById(id).addEventListener('click', e => {
    //     console.log(e);
    // })
    

    // cross.addEventListener('click', e => {
    //     // let kek = e.target.parentElement.getAttribute('data-id');
    //     console.log(e)
    //     // console.log(id)
    //     // db.collection('band').doc(id).delete();
    // })


form.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('band').add({
        name: form.name.value,
        comment: form.comment.value,
        time: new Date().toISOString()
    })
    form.name.value = '';
    form.comment.value = '';
})

getLiveData();
async function getLiveData() {
    await db.collection('band').onSnapshot(snapshot => {
     let change = snapshot.docChanges();
     change.forEach(change => {
         if (change.type == 'added') renderData(change.doc.data(), change.doc.id);
         else if (change.type == 'removed') {
             let id = document.getElementById(change.doc.id);
            //  let x = bandList.querySelector('[data-id=cX2J2JMMuKvaESIZWlV0]')
             let y = bandList.querySelector('[data-id="' + change.doc.id + '"]')
            //  console.log(y);
             y.remove();
         }
     })
 })
//  console.log(data)
}

// db.collection('band').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         console.log(doc.data());
//     });
// })

// function renderData(doc) {
//     let li = document.createElement('li');
//     let name = document.createElement('span');
//     let instrument = document.createElement('span');

//     li.setAttribute('data-id', doc.id);
//     name.textContent = doc.data().name;
//     instrument.textContent = doc.data().instrument;

//     li.appendChild(name);
//     li.appendChild(instrument);
//     bandList.appendChild(li);
// }

// console.log(new Date().toISOString().substring(14, 19))