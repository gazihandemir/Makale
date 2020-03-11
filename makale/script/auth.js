// auth durumunu izle
auth.onAuthStateChanged(k =>{
    //console.log(k);
    if(k){
        console.log('giris islemi basarili');
        // verileri getir
        db.collection('makaleler').onSnapshot((snapshot) =>{
            //console.log(snapshot.docs);
            makaleYukle(snapshot.docs);
            kullaniciYukle(k);
        })
    }else{
        console.log('cikis islemi basarili');
        makaleYukle([]);
        kullaniciYukle(); 
    }
});
// makale oluştur
const makaleOlusturForm = document.querySelector('#create-form');

makaleOlusturForm.addEventListener('submit',(e) => {
    e.preventDefault();

    db.collection('makaleler').add({
        baslik:makaleOlusturForm['title'].value,
        icerik:makaleOlusturForm['content'].value
    }).then(()=>{
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        makaleOlusturForm.reset();
    }).catch(err =>{
        console.log(err.message);
    });
});

// üyelik oluştur 
const uyelikForm  = document.querySelector('#signup-form');
uyelikForm.addEventListener('submit',(e) =>{
    e.preventDefault();
   //console.log('basarili');

    const mail = uyelikForm['signup-email'].value;
    const parola = uyelikForm['signup-password'].value;
    const kisiselBilgi = uyelikForm['signup-bio'].value;
    auth.createUserWithEmailAndPassword(mail,parola).then(sonuc => {
        console.log(sonuc.user);
        return db.collection('kullanicilar').doc(sonuc.user.uid).set({
            bio:uyelikForm['signup-bio'].value,
            email:uyelikForm['signup-email'].value
        }).then(() => {
            const modal = document.querySelector('#modal-signup');
            M.Modal.getInstance(modal).close();
            uyelikForm.reset();
        })
      
    });
    
});
// çıkış işlemi

const cikis = document.querySelector('#logout');
cikis.addEventListener('click',(e) =>{
    e.preventDefault();
    auth.signOut().then(()=>{
        console.log('cikis islemi basarili');
    })

});
// giris islemi 
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit',(e) => {
    e.preventDefault();
    const mail = loginForm['login-email'].value;
    const parola = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(mail, parola).then(sonuc =>{
     //    console.log(sonuc.user);
     //   console.log('giris basarili');
        const  modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    });
});
