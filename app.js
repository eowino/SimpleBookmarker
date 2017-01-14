;(function(global) {
    // 'new' an object
    let Bookmarker = function Bookmarker() {
        return new Bookmarker.init();   
    };
    
    // IIFE variables
    let bookmarkSession = JSON.parse(localStorage.getItem("bookmarkSession")) || {};
    let bookmarks = document.querySelector('.bookmark-section');
    let submit = document.querySelector('#submit');
    let website = document.querySelector('#website');
    let url = document.querySelector('#url');
    let deleteBtn;

    // prototype holds methods (to save memory space)
    Bookmarker.prototype = {
        submitHandler: function(site, href) {
            bookmarkSession[site] = href;
            return `<section class="bookmarks container">
                            <p>${site}</p>
                            <a target="_blank" href="http://${href}" class="btn btn-default btn-md">Visit</a>
                            <button class="btn btn-danger btn-md delete" data-site="${site}">Delete</button>
                        </section>`;
        },
        initDOM: function() {
            // checks if the bookmarkSession object exists
            if ( Object.keys(bookmarkSession).length !== 0 && bookmarkSession.constructor === Object ) {
                for(let item in bookmarkSession) {
                    Bookmarker.prototype.updateDOM(item, bookmarkSession[item]);
                }
            }
        },
        updateDOM: function(site, href) {
            bookmarks.innerHTML += Bookmarker.prototype.submitHandler(site, href);
            deleteBtn = document.getElementsByClassName('delete'); // initialises the deleteBtn variable
            Bookmarker.prototype.deleteListener(); // adds event handler to each delete button
        },
        checkInput: function() {
            return url.value && website.value ? true : false;
        },
        clearInput: function() {
            url.value = "";
            website.value = "";
        },
        addToLocalStorage: function(site, href) {
            bookmarkSession[site] = href;
            localStorage.setItem('bookmarkSession', JSON.stringify(bookmarkSession));
        },
        removeFromLocalStorage: function(target) {
            if ( bookmarkSession[target] ) {
                delete bookmarkSession[target];
                localStorage.setItem('bookmarkSession', JSON.stringify(bookmarkSession));
            }
        },
        deleteListener: function() {
            // Dynamically adds an eventListener to all delete buttons on the DOM
            Array.from(deleteBtn).forEach(function(element) {
            element.addEventListener('click', (element) => {
                let target = element.target.getAttribute('data-site');
                Bookmarker.prototype.removeFromLocalStorage(target);
                element.target.parentElement.remove(); // remove parent node from the view
            });
            });
        }
    };
    
    // the actual object is created here, allowing us to 'new' an object without calling 'new'
    Bookmarker.init = function() {
        submit.addEventListener('click', (e) => {
            e.preventDefault();

            if ( Bookmarker.prototype.checkInput() ) {
                Bookmarker.prototype.updateDOM(website.value, url.value);
                Bookmarker.prototype.addToLocalStorage(website.value, url.value);
                Bookmarker.prototype.clearInput();
            }
        });

        // loap App
        window.addEventListener('load', Bookmarker.prototype.initDOM);
    };

    Bookmarker.init();
    
    // trick borrowed from jQuery so no need to use the 'new' keyword
    Bookmarker.init.prototype = Bookmarker.prototype;
    
    // attach Bookmarker to the global object
    global.Bookmarker = Bookmarker;
    
}(window));