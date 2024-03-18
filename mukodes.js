var gyujtemenyek = {};
var elemek = {};

document.getElementById('ujGyujtemeny').addEventListener('click', function() {
    document.getElementById('collectionForm').style.display = 'block';
});
//Új gyűjtemény bekérése
document.getElementById('create').addEventListener('click', function() {
    var cim = document.getElementById('cim').value.trim();
    var temakor = document.getElementById('temakor').value.trim();
    var datum = document.getElementById('datum').value.trim();
    var kepMezo = document.getElementById('kep');
    var kep = kepMezo.files.length > 0 ? kepMezo.files[0] : null;

    if (cim === '') {
        alert('A cím mező kitöltése kötelező!');
        return;
    }else if(temakor === ''){
        alert('A témakör mező kitöltése kötelező!');
        return;
    }else if(datum === ''){
        alert('A dátum mezők kitöltése kötelező! (A naptárból válaszd ki a dátumot)');
        return;       
    }

    if (gyujtemenyek[cim]) {
        alert('Már létezik egy ilyen című gyűjtemény!');
        return;
    }
    // Gyűjtemény kiíratása
    var li = document.createElement('li');
    var cimMezo = document.createElement('span');
    cimMezo.className = 'cim';
    cimMezo.appendChild(document.createTextNode(`Gyűjtemény címe: ${cim}`));

    var temakorMezo = document.createElement('span');
    temakorMezo.className = 'temakor';
    temakorMezo.appendChild(document.createTextNode(`Témakör: ${temakor}`));

    var datumMezo = document.createElement('span');
    datumMezo.className = 'datum';
    datumMezo.appendChild(document.createTextNode(`Dátum: ${datum}`));

    if (kep) {
        var kepMegjelenito = document.createElement('img');
        kepMegjelenito.src = URL.createObjectURL(kep);
        kepMegjelenito.height = 100;
        li.appendChild(kepMegjelenito);
    }

    li.appendChild(cimMezo);
    li.appendChild(temakorMezo);
    li.appendChild(datumMezo);
    //Gyűjtemény átnevezése
    var renameButton = document.createElement('button');
    renameButton.textContent = 'Átnevezés';
    renameButton.addEventListener('click', function() {
        var ujCim = prompt('Adja meg az új címet:');
        if (!ujCim) {
            alert('A gyűjtemény címének megadása kötelező!');
            return;
        }

        if (gyujtemenyek[ujCim]) {
            alert('Már létezik egy ilyen című gyűjtemény!');
            return;
        }

        var collection = gyujtemenyek[cim];
        collection.cim = ujCim;
        gyujtemenyek[ujCim] = collection;
        delete gyujtemenyek[cim];
        cim = ujCim;
        cimMezo.textContent = `Gyűjtemény címe: ${ujCim}`;
    });
    li.appendChild(renameButton);

    //Elemek hozzáadása, megjelenítése
    var gyujtemeny = document.createElement('ul');
    li.appendChild(gyujtemeny);
    var addButton = document.createElement('button');
    addButton.textContent = 'Új elem hozzáadása';
    addButton.addEventListener('click', function() {
        var elemCim = prompt('Adja meg az elem címét:');
        if (!elemCim) {
            alert('Az elem cím mező kitöltése kötelező!');
            return;
        }

        var elemCimMezo = document.createTextNode(`Elem címe: ${elemCim}`);
        var itemLi = document.createElement('li');

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        itemLi.appendChild(checkbox);
        itemLi.appendChild(elemCimMezo);

        //Legördülő menü
        var dropdownDiv = document.createElement('div');
        dropdownDiv.className = 'dropdown';

        var dropdownButton = document.createElement('button');
        dropdownButton.textContent = '⚙️';
        dropdownButton.className = 'dropdownButton';
        dropdownDiv.appendChild(dropdownButton);

        var dropdownContentDiv = document.createElement('div');
        dropdownContentDiv.className = 'dropdown-content';

        var moveButton = document.createElement('button');
        moveButton.textContent = 'Áthelyezés';
        moveButton.addEventListener('click', function() {
            var gyujtemenyCim = prompt('Adjad meg a gyűjtemény címét, ahova át szeretné helyezni az elemet:');
            if (gyujtemenyek[gyujtemenyCim]) {
                gyujtemenyek[gyujtemenyCim].appendChild(itemLi);
                cim = gyujtemenyCim;
            } else {
                alert('Nem létezik ilyen című gyűjtemény!');
            }
        });

        dropdownContentDiv.appendChild(moveButton);

        var renameButton = document.createElement('button');
        renameButton.textContent = 'Átnevezés';
        renameButton.addEventListener('click', function() {
            var ujElemCim = prompt('Adja meg az új címet:');
            if (!ujElemCim) {
                alert('Az elem címének megadása kötelező!');
                return;
            }

            elemek[ujElemCim] = elemek[elemCim];
            delete elemek[elemCim];
            elemCim = ujElemCim;
            elemCimMezo.nodeValue = `Elem címe: ${ujElemCim}`;
        });

        dropdownContentDiv.appendChild(renameButton);

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Törlés';
        deleteButton.addEventListener('click', function() {
            gyujtemenyek[cim].removeChild(itemLi);
            delete elemek[elemCim];
            if (gyujtemeny.childNodes.length === 0) {
                li.removeChild(deleteAllButton);
            }
        });

        dropdownContentDiv.appendChild(deleteButton);
        dropdownDiv.appendChild(dropdownContentDiv);
        itemLi.appendChild(dropdownDiv);
        gyujtemeny.appendChild(itemLi);
        elemek[elemCim] = itemLi;

        // Az "Elemek törlése" gombot csak akkor jelenítjük meg, ha van elem a gyűjteményben
        if (gyujtemeny.childNodes.length === 1) {
            var deleteAllButton = document.createElement('button');
            deleteAllButton.textContent = 'Elemek törlése';
            deleteAllButton.addEventListener('click', function() {
                var checkboxes = gyujtemeny.getElementsByTagName('input');
                var noCheckboxSelected = true;
                for (var i = checkboxes.length - 1; i >= 0; i--) {
                    if (checkboxes[i].checked) {
                        noCheckboxSelected = false;
                        var itemLi = checkboxes[i].parentNode;
                        var elemCim = itemLi.textContent.trim();
                        gyujtemeny.removeChild(itemLi);
                        delete elemek[elemCim];
                    }
                }

                if(noCheckboxSelected){
                    alert('Jelöld ki a törölni kívánt elemet!');
                }

                // Ha már nincs elem a gyűjteményben, eltávolítjuk az "Elemek törlése" gombot
                if (gyujtemeny.childNodes.length === 0) {
                    li.removeChild(deleteAllButton);
                }
            });

            li.appendChild(deleteAllButton);
        }
    });

    li.appendChild(addButton);
    document.getElementById('gyujtemenyLista').appendChild(li);
    gyujtemenyek[cim] = gyujtemeny;

    document.getElementById('cim').value = '';
    document.getElementById('temakor').value = '';
    document.getElementById('datum').value = '';
    document.getElementById('kep').value = '';
    document.getElementById('collectionForm').style.display = 'none';
});
