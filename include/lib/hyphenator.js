/** @license Hyphenator 5.2.0(devel) - client side hyphenation for webbrowsers
 *  Copyright (C) 2015  Mathias Nater, Zürich (mathiasnater at gmail dot com)
 *  https://github.com/mnater/Hyphenator
 * 
 *  Released under the MIT license
 *  http://mnater.github.io/Hyphenator/LICENSE.txt
 */

/*
 * Comments are jsdoc3 formatted. See http://usejsdoc.org
 * Use mergeAndPack.html to get rid of the comments and to reduce the file size of this script!
 */

/* The following comment is for JSLint: */
/*jslint browser: true */

/**
 * @desc Provides all functionality to do hyphenation, except the patterns that are loaded externally
 * @global
 * @namespace Hyphenator
 * @author Mathias Nater, <mathias@mnn.ch>
 * @version 5.2.0(devel)
 * @example
 * &lt;script src = "Hyphenator.js" type = "text/javascript"&gt;&lt;/script&gt;
 * &lt;script type = "text/javascript"&gt;
 *   Hyphenator.run();
 * &lt;/script&gt;
 */
var Hyphenator = (function (window) {
    'use strict';

        /**
         * @member Hyphenator~contextWindow
         * @access private
         * @desc
         * contextWindow stores the window for the actual document to be hyphenated.
         * If there are frames this will change.
         * So use contextWindow instead of window!
         */
    var contextWindow = window,


        /**
         * @member {Object.<string, Hyphenator~supportedLangs~supportedLanguage>} Hyphenator~supportedLangs
         * @desc
         * A generated key-value object that stores supported languages and meta data.
         * The key is the {@link http://tools.ietf.org/rfc/bcp/bcp47.txt bcp47} code of the language and the value
         * is an object of type {@link Hyphenator~supportedLangs~supportedLanguage}
         * @namespace Hyphenator~supportedLangs
         * @access private
         * //Check if language lang is supported:
         * if (supportedLangs.hasOwnProperty(lang))
         */
        supportedLangs = (function () {
            /**
             * @typedef {Object} Hyphenator~supportedLangs~supportedLanguage
             * @property {string} file - The name of the pattern file
             * @property {number} script - The script type of the language (e.g. 'latin' for english), this type is abbreviated by an id
             * @property {string} prompt - The sentence prompted to the user, if Hyphenator.js doesn't find a language hint
             */

            /**
             * @lends Hyphenator~supportedLangs
             */
            var r = {},
                /**
                 * @method Hyphenator~supportedLangs~o
                 * @desc
                 * Sets a value of Hyphenator~supportedLangs
                 * @access protected
                 * @param {string} code The {@link http://tools.ietf.org/rfc/bcp/bcp47.txt bcp47} code of the language
                 * @param {string} file The name of the pattern file
                 * @param {Number} script A shortcut for a specific script: latin:0, cyrillic: 1, arabic: 2, armenian:3, bengali: 4, devangari: 5, greek: 6
                 * gujarati: 7, kannada: 8, lao: 9, malayalam: 10, oriya: 11, persian: 12, punjabi: 13, tamil: 14, telugu: 15
                 * @param {string} prompt The sentence prompted to the user, if Hyphenator.js doesn't find a language hint
                 */
                o = function (code, file, script, prompt) {
                    r[code] = {'file': file, 'script': script, 'prompt': prompt};
                };

            o('be', 'be.js', 1, 'Мова гэтага сайта не можа быць вызначаны аўтаматычна. Калі ласка пакажыце мову:');
            o('ca', 'ca.js', 0, '');
            o('cs', 'cs.js', 0, 'Jazyk této internetové stránky nebyl automaticky rozpoznán. Určete prosím její jazyk:');
            o('da', 'da.js', 0, 'Denne websides sprog kunne ikke bestemmes. Angiv venligst sprog:');
            o('bn', 'bn.js', 4, '');
            o('de', 'de.js', 0, 'Die Sprache dieser Webseite konnte nicht automatisch bestimmt werden. Bitte Sprache angeben:');
            o('el', 'el-monoton.js', 6, '');
            o('el-monoton', 'el-monoton.js', 6, '');
            o('el-polyton', 'el-polyton.js', 6, '');
            o('en', 'en-us.js', 0, 'The language of this website could not be determined automatically. Please indicate the main language:');
            o('en-gb', 'en-gb.js', 0, 'The language of this website could not be determined automatically. Please indicate the main language:');
            o('en-us', 'en-us.js', 0, 'The language of this website could not be determined automatically. Please indicate the main language:');
            o('eo', 'eo.js', 0, 'La lingvo de ĉi tiu retpaĝo ne rekoneblas aŭtomate. Bonvolu indiki ĝian ĉeflingvon:');
            o('es', 'es.js', 0, 'El idioma del sitio no pudo determinarse autom%E1ticamente. Por favor, indique el idioma principal:');
            o('et', 'et.js', 0, 'Veebilehe keele tuvastamine ebaõnnestus, palun valige kasutatud keel:');
            o('fi', 'fi.js', 0, 'Sivun kielt%E4 ei tunnistettu automaattisesti. M%E4%E4rit%E4 sivun p%E4%E4kieli:');
            o('fr', 'fr.js', 0, 'La langue de ce site n%u2019a pas pu %EAtre d%E9termin%E9e automatiquement. Veuillez indiquer une langue, s.v.p.%A0:');
            o('grc', 'grc.js', 6, '');
            o('gu', 'gu.js', 7, '');
            o('hi', 'hi.js', 5, '');
            o('hu', 'hu.js', 0, 'A weboldal nyelvét nem sikerült automatikusan megállapítani. Kérem adja meg a nyelvet:');
            o('hy', 'hy.js', 3, 'Չհաջողվեց հայտնաբերել այս կայքի լեզուն։ Խնդրում ենք նշեք հիմնական լեզուն՝');
            o('it', 'it.js', 0, 'Lingua del sito sconosciuta. Indicare una lingua, per favore:');
            o('kn', 'kn.js', 8, 'ಜಾಲ ತಾಣದ ಭಾಷೆಯನ್ನು ನಿರ್ಧರಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಮುಖ್ಯ ಭಾಷೆಯನ್ನು ಸೂಚಿಸಿ:');
            o('la', 'la.js', 0, '');
            o('lt', 'lt.js', 0, 'Nepavyko automatiškai nustatyti šios svetainės kalbos. Prašome įvesti kalbą:');
            o('lv', 'lv.js', 0, 'Šīs lapas valodu nevarēja noteikt automātiski. Lūdzu norādiet pamata valodu:');
            o('ml', 'ml.js', 10, 'ഈ വെ%u0D2C%u0D4D%u200Cസൈറ്റിന്റെ ഭാഷ കണ്ടുപിടിയ്ക്കാ%u0D28%u0D4D%u200D കഴിഞ്ഞില്ല. ഭാഷ ഏതാണെന്നു തിരഞ്ഞെടുക്കുക:');
            o('nb', 'nb-no.js', 0, 'Nettstedets språk kunne ikke finnes automatisk. Vennligst oppgi språk:');
            o('no', 'nb-no.js', 0, 'Nettstedets språk kunne ikke finnes automatisk. Vennligst oppgi språk:');
            o('nb-no', 'nb-no.js', 0, 'Nettstedets språk kunne ikke finnes automatisk. Vennligst oppgi språk:');
            o('nl', 'nl.js', 0, 'De taal van deze website kan niet automatisch worden bepaald. Geef de hoofdtaal op:');
            o('or', 'or.js', 11, '');
            o('pa', 'pa.js', 13, '');
            o('pl', 'pl.js', 0, 'Języka tej strony nie można ustalić automatycznie. Proszę wskazać język:');
            o('pt', 'pt.js', 0, 'A língua deste site não pôde ser determinada automaticamente. Por favor indique a língua principal:');
            o('ru', 'ru.js', 1, 'Язык этого сайта не может быть определен автоматически. Пожалуйста укажите язык:');
            o('sk', 'sk.js', 0, '');
            o('sl', 'sl.js', 0, 'Jezika te spletne strani ni bilo mogoče samodejno določiti. Prosim navedite jezik:');
            o('sr-cyrl', 'sr-cyrl.js', 1, 'Језик овог сајта није детектован аутоматски. Молим вас наведите језик:');
            o('sr-latn', 'sr-latn.js', 0, 'Jezika te spletne strani ni bilo mogoče samodejno določiti. Prosim navedite jezik:');
            o('sv', 'sv.js', 0, 'Spr%E5ket p%E5 den h%E4r webbplatsen kunde inte avg%F6ras automatiskt. V%E4nligen ange:');
            o('ta', 'ta.js', 14, '');
            o('te', 'te.js', 15, '');
            o('tr', 'tr.js', 0, 'Bu web sitesinin dili otomatik olarak tespit edilememiştir. Lütfen dökümanın dilini seçiniz%A0:');
            o('uk', 'uk.js', 1, 'Мова цього веб-сайту не може бути визначена автоматично. Будь ласка, вкажіть головну мову:');
            o('ro', 'ro.js', 0, 'Limba acestui sit nu a putut fi determinată automat. Alege limba principală:');

            return r;
        }()),


        /**
         * @member {string} Hyphenator~basePath
         * @desc
         * A string storing the basepath from where Hyphenator.js was loaded.
         * This is used to load the pattern files.
         * The basepath is determined dynamically by searching all script-tags for Hyphenator.js
         * If the path cannot be determined {@link http://mnater.github.io/Hyphenator/} is used as fallback.
         * @access private
         * @see {@link Hyphenator~loadPatterns}
         */
        basePath = (function () {
            var s = contextWindow.document.getElementsByTagName('script'), i = 0, p, src, t = s[i], r = '';
            while (!!t) {
                if (!!t.src) {
                    src = t.src;
                    p = src.indexOf('Hyphenator.js');
                    if (p !== -1) {
                        r = src.substring(0, p);
                    }
                }
                i += 1;
                t = s[i];
            }
            return !!r ? r : '//mnater.github.io/Hyphenator/';
        }()),

        /**
         * @member {boolean} Hyphenator~isLocal
         * @access private
         * @desc
         * isLocal is true, if Hyphenator is loaded from the same domain, as the webpage, but false, if
         * it's loaded from an external source (i.e. directly from github)
         */
        isLocal = (function () {
            var re = false;
            if (window.location.href.indexOf(basePath) !== -1) {
                re = true;
            }
            return re;
        }()),

        /**
         * @member {boolean} Hyphenator~documentLoaded
         * @access private
         * @desc
         * documentLoaded is true, when the DOM has been loaded. This is set by {@link Hyphenator~runWhenLoaded}
         */
        documentLoaded = false,

        /**
         * @member {boolean} Hyphenator~persistentConfig
         * @access private
         * @desc
         * if persistentConfig is set to true (defaults to false), config options and the state of the 
         * toggleBox are stored in DOM-storage (according to the storage-setting). So they haven't to be
         * set for each page.
         * @default false
         * @see {@link Hyphenator.config}
         */
        persistentConfig = false,

        /**
         * @member {boolean} Hyphenator~doFrames
         * @access private
         * @desc
         * switch to control if frames/iframes should be hyphenated, too.
         * defaults to false (frames are a bag of hurt!)
         * @default false
         * @see {@link Hyphenator.config}
         */
        doFrames = false,

        /**
         * @member {Object.<string,boolean>} Hyphenator~dontHyphenate
         * @desc
         * A key-value object containing all html-tags whose content should not be hyphenated
         * @access private
         */
        dontHyphenate = {'video': true, 'audio': true, 'script': true, 'code': true, 'pre': true, 'img': true, 'br': true, 'samp': true, 'kbd': true, 'var': true, 'abbr': true, 'acronym': true, 'sub': true, 'sup': true, 'button': true, 'option': true, 'label': true, 'textarea': true, 'input': true, 'math': true, 'svg': true, 'style': true},

        /**
         * @member {boolean} Hyphenator~enableCache
         * @desc
         * A variable to set if caching is enabled or not
         * @default true
         * @access private
         * @see {@link Hyphenator.config}
         */
        enableCache = true,

        /**
         * @member {string} Hyphenator~storageType
         * @desc
         * A variable to define what html5-DOM-Storage-Method is used ('none', 'local' or 'session')
         * @default 'local'
         * @access private
         * @see {@link Hyphenator.config}
         */
        storageType = 'local',

        /**
         * @member {Object|undefined} Hyphenator~storage
         * @desc
         * An alias to the storage defined in storageType. This is set by {@link Hyphenator~createStorage}.
         * Set by {@link Hyphenator.run}
         * @default null
         * @access private
         * @see {@link Hyphenator~createStorage}
         */
        storage,

        /**
         * @member {boolean} Hyphenator~enableReducedPatternSet
         * @desc
         * A variable to set if storing the used patterns is set
         * @default false
         * @access private
         * @see {@link Hyphenator.config}
         * @see {@link Hyphenator.getRedPatternSet}
         */
        enableReducedPatternSet = false,

        /**
         * @member {boolean} Hyphenator~enableRemoteLoading
         * @desc
         * A variable to set if pattern files should be loaded remotely or not
         * @default true
         * @access private
         * @see {@link Hyphenator.config}
         */
        enableRemoteLoading = true,

        /**
         * @member {boolean} Hyphenator~displayToggleBox
         * @desc
         * A variable to set if the togglebox should be displayed or not
         * @default false
         * @access private
         * @see {@link Hyphenator.config}
         */
        displayToggleBox = false,

        /**
         * @method Hyphenator~onError
         * @desc
         * A function that can be called upon an error.
         * @see {@link Hyphenator.config}
         * @access private
         */
        onError = function (e) {
            window.alert("Hyphenator.js says:\n\nAn Error occurred:\n" + e.message);
        },

        /**
         * @method Hyphenator~onWarning
         * @desc
         * A function that can be called upon a warning.
         * @see {@link Hyphenator.config}
         * @access private
         */
        onWarning = function (e) {
            window.console.log(e.message);
        },

        /**
         * @method Hyphenator~createElem
         * @desc
         * A function alias to document.createElementNS or document.createElement
         * @access private
         */
        createElem = function (tagname, context) {
            context = context || contextWindow;
            var el;
            if (window.document.createElementNS) {
                el = context.document.createElementNS('http://www.w3.org/1999/xhtml', tagname);
            } else if (window.document.createElement) {
                el = context.document.createElement(tagname);
            }
            return el;
        },

        /**
         * @member {boolean} Hyphenator~css3
         * @desc
         * A variable to set if css3 hyphenation should be used
         * @default false
         * @access private
         * @see {@link Hyphenator.config}
         */
        css3 = false,

        /**
         * @typedef {Object} Hyphenator~css3_hsupport
         * @property {boolean} support - if css3-hyphenation is supported
         * @property {string} property - the css property name to access hyphen-settings (e.g. -webkit-hyphens)
         * @property {Object.<string, boolean>} supportedBrowserLangs - an object caching tested languages
         * @property {function} checkLangSupport - a method that checks if the browser supports a requested language
         */

        /**
         * @member {Hyphenator~css3_h9n} Hyphenator~css3_h9n
         * @desc
         * A generated object containing information for CSS3-hyphenation support
         * This is set by {@link Hyphenator~css3_gethsupport}
         * @default undefined
         * @access private
         * @see {@link Hyphenator~css3_gethsupport}
         * @example
         * //Check if browser supports a language
         * css3_h9n.checkLangSupport(&lt;lang&gt;)
         */
        css3_h9n,

        /**
         * @method Hyphenator~css3_gethsupport
         * @desc
         * This function sets {@link Hyphenator~css3_h9n} for the current UA
         * @type function
         * @access private
         * @see Hyphenator~css3_h9n
         */
        css3_gethsupport = function () {
            var s,
                createLangSupportChecker = function (prefix) {
                    var testStrings = [
                        //latin: 0
                        'aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz',
                        //cyrillic: 1
                        'абвгдеёжзийклмнопрстуфхцчшщъыьэюя',
                        //arabic: 2
                        'أبتثجحخدذرزسشصضطظعغفقكلمنهوي',
                        //armenian: 3
                        'աբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքօֆ',
                        //bengali: 4
                        'ঁংঃঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃৄেৈোৌ্ৎৗড়ঢ়য়ৠৡৢৣ',
                        //devangari: 5
                        'ँंःअआइईउऊऋऌएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलळवशषसहऽािीुूृॄेैोौ्॒॑ॠॡॢॣ',
                        //greek: 6
                        'αβγδεζηθικλμνξοπρσςτυφχψω',
                        //gujarati: 7
                        'બહઅઆઇઈઉઊઋૠએઐઓઔાિીુૂૃૄૢૣેૈોૌકખગઘઙચછજઝઞટઠડઢણતથદધનપફસભમયરલળવશષ',
                        //kannada: 8
                        'ಂಃಅಆಇಈಉಊಋಌಎಏಐಒಓಔಕಖಗಘಙಚಛಜಝಞಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಱಲಳವಶಷಸಹಽಾಿೀುೂೃೄೆೇೈೊೋೌ್ೕೖೞೠೡ',
                        //lao: 9
                        'ກຂຄງຈຊຍດຕຖທນບປຜຝພຟມຢຣລວສຫອຮະັາິີຶືຸູົຼເແໂໃໄ່້໊໋ໜໝ',
                        //malayalam: 10
                        'ംഃഅആഇഈഉഊഋഌഎഏഐഒഓഔകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനപഫബഭമയരറലളഴവശഷസഹാിീുൂൃെേൈൊോൌ്ൗൠൡൺൻർൽൾൿ',
                        //oriya: 11
                        'ଁଂଃଅଆଇଈଉଊଋଌଏଐଓଔକଖଗଘଙଚଛଜଝଞଟଠଡଢଣତଥଦଧନପଫବଭମଯରଲଳଵଶଷସହାିୀୁୂୃେୈୋୌ୍ୗୠୡ',
                        //persian: 12
                        'أبتثجحخدذرزسشصضطظعغفقكلمنهوي',
                        //punjabi: 13
                        'ਁਂਃਅਆਇਈਉਊਏਐਓਔਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਲ਼ਵਸ਼ਸਹਾਿੀੁੂੇੈੋੌ੍ੰੱ',
                        //tamil: 14
                        'ஃஅஆஇஈஉஊஎஏஐஒஓஔகஙசஜஞடணதநனபமயரறலளழவஷஸஹாிீுூெேைொோௌ்ௗ',
                        //telugu: 15
                        'ఁంఃఅఆఇఈఉఊఋఌఎఏఐఒఓఔకఖగఘఙచఛజఝఞటఠడఢణతథదధనపఫబభమయరఱలళవశషసహాిీుూృౄెేైొోౌ్ౕౖౠౡ'
                    ],
                        f = function (lang) {
                            var shadow,
                                computedHeight,
                                bdy,
                                r = false;

                            //check if lang has already been tested
                            if (this.supportedBrowserLangs.hasOwnProperty(lang)) {
                                r = this.supportedBrowserLangs[lang];
                            } else if (supportedLangs.hasOwnProperty(lang)) {
                                //create and append shadow-test-element
                                bdy = window.document.getElementsByTagName('body')[0];
                                shadow = createElem('div', window);
                                shadow.id = 'Hyphenator_LanguageChecker';
                                shadow.style.width = '5em';
                                shadow.style.padding = '0';
                                shadow.style.border = 'none';
                                shadow.style[prefix] = 'auto';
                                shadow.style.hyphens = 'auto';
                                shadow.style.fontSize = '12px';
                                shadow.style.lineHeight = '12px';
                                shadow.style.wordWrap = 'normal';
                                shadow.style.visibility = 'hidden';
                                shadow.lang = lang;
                                shadow.style['-webkit-locale'] = "'" + lang + "'";
                                shadow.innerHTML = testStrings[supportedLangs[lang].script];
                                bdy.appendChild(shadow);
                                //measure its height
                                computedHeight = shadow.offsetHeight;
                                //remove shadow element
                                bdy.removeChild(shadow);
                                r = (computedHeight > 12) ? true : false;
                                this.supportedBrowserLangs[lang] = r;
                            } else {
                                r = false;
                            }
                            return r;
                        };
                    return f;
                },
                r = {
                    support: false,
                    supportedBrowserLangs: {},
                    property: '',
                    checkLangSupport: {}
                };

            if (window.getComputedStyle) {
                s = window.getComputedStyle(window.document.getElementsByTagName('body')[0], null);
            } else {
                //ancient Browsers don't support CSS3 anyway
                css3_h9n = r;
                return;
            }

            if (s.hyphens !== undefined) {
                r.support = true;
                r.property = 'hyphens';
                r.checkLangSupport = createLangSupportChecker('hyphens');
            } else if (s['-webkit-hyphens'] !== undefined) {
                r.support = true;
                r.property = '-webkit-hyphens';
                r.checkLangSupport = createLangSupportChecker('-webkit-hyphens');
            } else if (s.MozHyphens !== undefined) {
                r.support = true;
                r.property = '-moz-hyphens';
                r.checkLangSupport = createLangSupportChecker('MozHyphens');
            } else if (s['-ms-hyphens'] !== undefined) {
                r.support = true;
                r.property = '-ms-hyphens';
                r.checkLangSupport = createLangSupportChecker('-ms-hyphens');
            }
            css3_h9n = r;
        },

        /**
         * @member {string} Hyphenator~hyphenateClass
         * @desc
         * A string containing the css-class-name for the hyphenate class
         * @default 'hyphenate'
         * @access private
         * @example
         * &lt;p class = "hyphenate"&gt;Text&lt;/p&gt;
         * @see {@link Hyphenator.config}
         */
        hyphenateClass = 'hyphenate',

        /**
         * @member {string} Hyphenator~urlHyphenateClass
         * @desc
         * A string containing the css-class-name for the urlhyphenate class
         * @default 'urlhyphenate'
         * @access private
         * @example
         * &lt;p class = "urlhyphenate"&gt;Text&lt;/p&gt;
         * @see {@link Hyphenator.config}
         */
        urlHyphenateClass = 'urlhyphenate',

        /**
         * @member {string} Hyphenator~classPrefix
         * @desc
         * A string containing a unique className prefix to be used
         * whenever Hyphenator sets a CSS-class
         * @access private
         */
        classPrefix = 'Hyphenator' + Math.round(Math.random() * 1000),

        /**
         * @member {string} Hyphenator~hideClass
         * @desc
         * The name of the class that hides elements
         * @access private
         */
        hideClass = classPrefix + 'hide',

        /**
         * @member {RegExp} Hyphenator~hideClassRegExp
         * @desc
         * RegExp to remove hideClass from a list of classes
         * @access private
         */
        hideClassRegExp = new RegExp("\\s?\\b" + hideClass + "\\b", "g"),

        /**
         * @member {string} Hyphenator~hideClass
         * @desc
         * The name of the class that unhides elements
         * @access private
         */
        unhideClass = classPrefix + 'unhide',

        /**
         * @member {RegExp} Hyphenator~hideClassRegExp
         * @desc
         * RegExp to remove unhideClass from a list of classes
         * @access private
         */
        unhideClassRegExp = new RegExp("\\s?\\b" + unhideClass + "\\b", "g"),

        /**
         * @member {string} Hyphenator~css3hyphenateClass
         * @desc
         * The name of the class that hyphenates elements with css3
         * @access private
         */
        css3hyphenateClass = classPrefix + 'css3hyphenate',

        /**
         * @member {CSSEdit} Hyphenator~css3hyphenateClass
         * @desc
         * The var where CSSEdit class is stored
         * @access private
         */
        css3hyphenateClassHandle,

        /**
         * @member {string} Hyphenator~dontHyphenateClass
         * @desc
         * A string containing the css-class-name for elements that should not be hyphenated
         * @default 'donthyphenate'
         * @access private
         * @example
         * &lt;p class = "donthyphenate"&gt;Text&lt;/p&gt;
         * @see {@link Hyphenator.config}
         */
        dontHyphenateClass = 'donthyphenate',

        /**
         * @member {number} Hyphenator~min
         * @desc
         * A number wich indicates the minimal length of words to hyphenate.
         * @default 6
         * @access private
         * @see {@link Hyphenator.config}
         */
        min = 6,

        /**
         * @member {number} Hyphenator~orphanControl
         * @desc
         * Control how the last words of a line are handled:
         * level 1 (default): last word is hyphenated
         * level 2: last word is not hyphenated
         * level 3: last word is not hyphenated and last space is non breaking
         * @default 1
         * @access private
         */
        orphanControl = 1,

        /**
         * @member {boolean} Hyphenator~isBookmarklet
         * @desc
         * True if Hyphanetor runs as bookmarklet.
         * @access private
         */
        isBookmarklet = (function () {
            var loc = null,
                re = false,
                scripts = contextWindow.document.getElementsByTagName('script'),
                i = 0,
                l = scripts.length;
            while (!re && i < l) {
                loc = scripts[i].getAttribute('src');
                if (!!loc && loc.indexOf('Hyphenator.js?bm=true') !== -1) {
                    re = true;
                }
                i += 1;
            }
            return re;
        }()),

        /**
         * @member {string|null} Hyphenator~mainLanguage
         * @desc
         * The general language of the document. In contrast to {@link Hyphenator~defaultLanguage},
         * mainLanguage is defined by the client (i.e. by the html or by a prompt).
         * @access private
         * @see {@link Hyphenator~autoSetMainLanguage}
         */
        mainLanguage = null,

        /**
         * @member {string|null} Hyphenator~defaultLanguage
         * @desc
         * The language defined by the developper. This language setting is defined by a config option.
         * It is overwritten by any html-lang-attribute and only taken in count, when no such attribute can
         * be found (i.e. just before the prompt).
         * @access private
         * @see {@link Hyphenator.config}
         * @see {@link Hyphenator~autoSetMainLanguage}
         */
        defaultLanguage = '',

        /**
         * @member {ElementCollection} Hyphenator~elements
         * @desc
         * A class representing all elements (of type Element) that have to be hyphenated. This var is filled by
         * {@link Hyphenator~gatherDocumentInfos}
         * @access private
         */
        elements = (function () {
            /**
             * @constructor Hyphenator~elements~ElementCollection~Element
             * @desc represents a DOM Element with additional information
             * @access private
             */
            var Element = function (element) {
                /**
                 * @member {Object} Hyphenator~elements~ElementCollection~Element~element
                 * @desc A DOM Element
                 * @access protected
                 */
                this.element = element;
                /**
                 * @member {boolean} Hyphenator~elements~ElementCollection~Element~hyphenated
                 * @desc Marks if the element has been hyphenated
                 * @access protected
                 */
                this.hyphenated = false;
                /**
                 * @member {boolean} Hyphenator~elements~ElementCollection~Element~treated
                 * @desc Marks if information of the element has been collected but not hyphenated (e.g. dohyphenation is off)
                 * @access protected
                 */
                this.treated = false;
            },
                /**
                 * @constructor Hyphenator~elements~ElementCollection
                 * @desc A collection of Elements to be hyphenated
                 * @access protected
                 */
                ElementCollection = function () {
                    /**
                     * @member {number} Hyphenator~elements~ElementCollection~count
                     * @desc The Number of collected Elements
                     * @access protected
                     */
                    this.count = 0;
                    /**
                     * @member {number} Hyphenator~elements~ElementCollection~hyCount
                     * @desc The Number of hyphenated Elements
                     * @access protected
                     */
                    this.hyCount = 0;
                    /**
                     * @member {Object.<string, Array.<Element>>} Hyphenator~elements~ElementCollection~list
                     * @desc The collection of elements, where the key is a language code and the value is an array of elements
                     * @access protected
                     */
                    this.list = {};
                };
            /**
             * @member {Object} Hyphenator~elements~ElementCollection.prototype
             * @augments Hyphenator~elements~ElementCollection
             * @access protected
             */
            ElementCollection.prototype = {
                /**
                 * @method Hyphenator~elements~ElementCollection.prototype~add
                 * @augments Hyphenator~elements~ElementCollection
                 * @access protected
                 * @desc adds a DOM element to the collection
                 * @param {Object} el - The DOM element
                 * @param {string} lang - The language of the element
                 */
                add: function (el, lang) {
                    var elo = new Element(el);
                    if (!this.list.hasOwnProperty(lang)) {
                        this.list[lang] = [];
                    }
                    this.list[lang].push(elo);
                    this.count += 1;
                    return elo;
                },

                /**
                 * @method Hyphenator~elements~ElementCollection.prototype~remove
                 * @augments Hyphenator~elements~ElementCollection
                 * @access protected
                 * @desc removes a DOM element from the collection
                 * @param {Object} el - The DOM element
                 */
                remove: function (el) {
                    var lang, i, e, l;
                    for (lang in this.list) {
                        if (this.list.hasOwnProperty(lang)) {
                            for (i = 0; i < this.list[lang].length; i += 1) {
                                if (this.list[lang][i].element === el) {
                                    e = i;
                                    l = lang;
                                    break;
                                }
                            }
                        }
                    }
                    this.list[l].splice(e, 1);
                    this.count -= 1;
                    this.hyCount -= 1;
                },
                /**
                 * @callback Hyphenator~elements~ElementCollection.prototype~each~callback fn - The callback that is executed for each element
                 * @param {string} [k] The key (i.e. language) of the collection
                 * @param {Hyphenator~elements~ElementCollection~Element} element
                 */

                /**
                 * @method Hyphenator~elements~ElementCollection.prototype~each
                 * @augments Hyphenator~elements~ElementCollection
                 * @access protected
                 * @desc takes each element of the collection as an argument of fn
                 * @param {Hyphenator~elements~ElementCollection.prototype~each~callback} fn - A function that takes an element as an argument
                 */
                each: function (fn) {
                    var k;
                    for (k in this.list) {
                        if (this.list.hasOwnProperty(k)) {
                            if (fn.length === 2) {
                                fn(k, this.list[k]);
                            } else {
                                fn(this.list[k]);
                            }
                        }
                    }
                }
            };
            return new ElementCollection();
        }()),


        /**
         * @member {Object.<sting, string>} Hyphenator~exceptions
         * @desc
         * An object containing exceptions as comma separated strings for each language.
         * When the language-objects are loaded, their exceptions are processed, copied here and then deleted.
         * Exceptions can also be set by the user.
         * @see {@link Hyphenator~prepareLanguagesObj}
         * @access private
         */
        exceptions = {},

        /**
         * @member {Object.<string, boolean>} Hyphenator~docLanguages
         * @desc
         * An object holding all languages used in the document. This is filled by
         * {@link Hyphenator~gatherDocumentInfos}
         * @access private
         */
        docLanguages = {},

        /**
         * @member {string} Hyphenator~url
         * @desc
         * A string containing a insane RegularExpression to match URL's
         * @access private
         */
        url = '(?:\\w*:\/\/)?(?:(?:\\w*:)?(?:\\w*)@)?(?:(?:(?:[\\d]{1,3}\\.){3}(?:[\\d]{1,3}))|(?:(?:www\\.|[a-zA-Z]\\.)?[a-zA-Z0-9\\-\\.]+\\.(?:[a-z]{2,4})))(?::\\d*)?(?:\/[\\w#!:\\.?\\+=&%@!\\-]*)*',
        //      protocoll     usr     pwd                    ip               or                          host                 tld        port               path

        /**
         * @member {string} Hyphenator~mail
         * @desc
         * A string containing a RegularExpression to match mail-adresses
         * @access private
         */
        mail = '[\\w-\\.]+@[\\w\\.]+',

        /**
         * @member {string} Hyphenator~zeroWidthSpace
         * @desc
         * A string that holds a char.
         * Depending on the browser, this is the zero with space or an empty string.
         * zeroWidthSpace is used to break URLs
         * @access private
         */
        zeroWidthSpace = (function () {
            var zws, ua = window.navigator.userAgent.toLowerCase();
            zws = String.fromCharCode(8203); //Unicode zero width space
            if (ua.indexOf('msie 6') !== -1) {
                zws = ''; //IE6 doesn't support zws
            }
            if (ua.indexOf('opera') !== -1 && ua.indexOf('version/10.00') !== -1) {
                zws = ''; //opera 10 on XP doesn't support zws
            }
            return zws;
        }()),

        /**
         * @method Hyphenator~onBeforeWordHyphenation
         * @desc
         * This method is called just before a word is hyphenated.
         * It is called with two parameters: the word and its language.
         * The method must return a string (aka the word).
         * @see {@link Hyphenator.config}
         * @access private
         * @param {string} word
         * @param {string} lang
         * @return {string} The word that goes into hyphenation
         */
        onBeforeWordHyphenation = function (word) {
            return word;
        },

        /**
         * @method Hyphenator~onAfterWordHyphenation
         * @desc
         * This method is called for each word after it is hyphenated.
         * Takes the word as a first parameter and its language as a second parameter.
         * Returns a string that will replace the word that has been hyphenated.
         * @see {@link Hyphenator.config}
         * @access private
         * @param {string} word
         * @param {string} lang
         * @return {string} The word that goes into hyphenation
         */
        onAfterWordHyphenation = function (word) {
            return word;
        },

        /**
         * @method Hyphenator~onHyphenationDone
         * @desc
         * A method to be called, when the last element has been hyphenated.
         * If there are frames the method is called for each frame.
         * Therefore the location.href of the contextWindow calling this method is given as a parameter
         * @see {@link Hyphenator.config}
         * @param {string} context
         * @access private
         */
        onHyphenationDone = function (context) {
            return context;
        },

        /**
         * @name Hyphenator~selectorFunction
         * @desc
         * A function set by the user that has to return a HTMLNodeList or array of Elements to be hyphenated.
         * By default this is set to false so we can check if a selectorFunction is set…
         * @see {@link Hyphenator.config}
         * @see {@link Hyphenator~mySelectorFunction}
         * @default false
         * @type {function|boolean}
         * @access private
         */
        selectorFunction = false,

        /**
         * @name Hyphenator~flattenNodeList
         * @desc
         * Takes a nodeList and returns an array with all elements that are not contained by another element in the nodeList
         * By using this function the elements returned by selectElements can be 'flattened'.
         * @see {@link Hyphenator~selectElements}
         * @param {nodeList} nl
         * @return {Array} Array of 'parent'-elements
         * @access private
         */
        flattenNodeList = function (nl) {
            var parentElements = [],
                i = 0,
                j = 0,
                isParent = true;

            parentElements.push(nl[0]); //add the first item, since this is always an parent

            for (i = 1; i < nl.length; i += 1) { //cycle through nodeList
                for (j = 0; j < parentElements.length; j += 1) { //cycle through parentElements
                    if (parentElements[j].contains(nl[i])) {
                        isParent = false;
                        break;
                    }
                }
                if (isParent) {
                    parentElements.push(nl[i]);
                }
                isParent = true;
            }

            return parentElements;
        },

        /**
         * @method Hyphenator~mySelectorFunction
         * @desc
         * A function that returns a HTMLNodeList or array of Elements to be hyphenated.
         * By default it uses the classname ('hyphenate') to select the elements.
         * @access private
         */
        mySelectorFunction = function (hyphenateClass) {
            var tmp, el = [], i, l;
            if (window.document.getElementsByClassName) {
                el = contextWindow.document.getElementsByClassName(hyphenateClass);
            } else if (window.document.querySelectorAll) {
                el = contextWindow.document.querySelectorAll('.' + hyphenateClass);
            } else {
                tmp = contextWindow.document.getElementsByTagName('*');
                l = tmp.length;
                for (i = 0; i < l; i += 1) {
                    if (tmp[i].className.indexOf(hyphenateClass) !== -1 && tmp[i].className.indexOf(dontHyphenateClass) === -1) {
                        el.push(tmp[i]);
                    }
                }
            }
            return el;
        },

        /**
         * @method Hyphenator~selectElements
         * @desc
         * A function that uses either selectorFunction set by the user
         * or the default mySelectorFunction.
         * @access private
         */
        selectElements = function () {
            var elems;
            if (selectorFunction) {
                elems = selectorFunction();
            } else {
                elems = mySelectorFunction(hyphenateClass);
            }
            if (elems.length !== 0) {
                elems = flattenNodeList(elems);
            }
            return elems;
        },

        /**
         * @member {string} Hyphenator~intermediateState
         * @desc
         * The visibility of elements while they are hyphenated:
         * 'visible': unhyphenated text is visible and then redrawn when hyphenated.
         * 'hidden': unhyphenated text is made invisible as soon as possible and made visible after hyphenation.
         * @default 'hidden'
         * @see {@link Hyphenator.config}
         * @access private
         */
        intermediateState = 'hidden',

        /**
         * @member {string} Hyphenator~unhide
         * @desc
         * How hidden elements unhide: either simultaneous (default: 'wait') or progressively.
         * 'wait' makes Hyphenator.js to wait until all elements are hyphenated (one redraw)
         * With 'progressive' Hyphenator.js unhides elements as soon as they are hyphenated.
         * @see {@link Hyphenator.config}
         * @access private
         */
        unhide = 'wait',

        /**
         * @member {Array.<Hyphenator~CSSEdit>} Hyphenator~CSSEditors
         * @desc A container array that holds CSSEdit classes
         * For each window object one CSSEdit class is inserted
         * @access private
         */
        CSSEditors = [],

        /**
         * @constructor Hyphenator~CSSEdit
         * @desc
         * This class handles access and editing of StyleSheets.
         * Thanks to this styles (e.g. hiding and unhiding elements upon hyphenation)
         * can be changed in one place instead for each element.
         * @access private
         */
        CSSEdit = function (w) {
            w = w || window;
            var doc = w.document,
                /**
                 * @member {Object} Hyphenator~CSSEdit~sheet
                 * @desc
                 * A StyleSheet, where Hyphenator can write to.
                 * If no StyleSheet can be found, lets create one. 
                 * @access private
                 */
                sheet = (function () {
                    var i,
                        l = doc.styleSheets.length,
                        s,
                        element,
                        r = false;
                    for (i = 0; i < l; i += 1) {
                        s = doc.styleSheets[i];
                        try {
                            if (!!s.cssRules) {
                                r = s;
                                break;
                            }
                        } catch (ignore) {}
                    }
                    if (r === false) {
                        element = doc.createElement('style');
                        element.type = 'text/css';
                        doc.getElementsByTagName('head')[0].appendChild(element);
                        r = doc.styleSheets[doc.styleSheets.length - 1];
                    }
                    return r;
                }()),

                /**
                 * @typedef {Object} Hyphenator~CSSEdit~changes
                 * @property {Object} sheet - The StyleSheet where the change was made
                 * @property {number} index - The index of the changed rule
                 */

                /**
                 * @member {Array.<changes>} Hyphenator~CSSEdit~changes
                 * @desc
                 * Sets a CSS rule for a specified selector
                 * @access private
                 */
                changes = [],

                /**
                 * @typedef Hyphenator~CSSEdit~rule
                 * @property {number} index - The index of the rule
                 * @property {Object} rule - The style rule
                 */
                /**
                 * @method Hyphenator~CSSEdit~findRule
                 * @desc
                 * Searches the StyleSheets for a given selector and returns an object containing the rule.
                 * If nothing can be found, false is returned.
                 * @param {string} sel 
                 * @return {Hyphenator~CSSEdit~rule|false}
                 * @access private
                 */
                findRule = function (sel) {
                    var s, rule, sheets = w.document.styleSheets, rules, i, j, r = false;
                    for (i = 0; i < sheets.length; i += 1) {
                        s = sheets[i];
                        try { //FF has issues here with external CSS (s.o.p)
                            if (!!s.cssRules) {
                                rules = s.cssRules;
                            } else if (!!s.rules) {
                                // IE < 9
                                rules = s.rules;
                            }
                        } catch (ignore) {}
                        if (!!rules && !!rules.length) {
                            for (j = 0; j < rules.length; j += 1) {
                                rule = rules[j];
                                if (rule.selectorText === sel) {
                                    r = {
                                        index: j,
                                        rule: rule
                                    };
                                }
                            }
                        }
                    }
                    return r;
                },
                /**
                 * @method Hyphenator~CSSEdit~addRule
                 * @desc
                 * Adds a rule to the {@link Hyphenator~CSSEdit~sheet}
                 * @param {string} sel - The selector to be added
                 * @param {string} rulesStr - The rules for the specified selector
                 * @return {number} index of the new rule
                 * @access private
                 */
                addRule = function (sel, rulesStr) {
                    var i, r;
                    if (!!sheet.insertRule) {
                        if (!!sheet.cssRules) {
                            i = sheet.cssRules.length;
                        } else {
                            i = 0;
                        }
                        r = sheet.insertRule(sel + '{' + rulesStr + '}', i);
                    } else if (!!sheet.addRule) {
                        // IE < 9
                        if (!!sheet.rules) {
                            i = sheet.rules.length;
                        } else {
                            i = 0;
                        }
                        sheet.addRule(sel, rulesStr, i);
                        r = i;
                    }
                    return r;
                },
                /**
                 * @method Hyphenator~CSSEdit~removeRule
                 * @desc
                 * Removes a rule with the specified index from the specified sheet
                 * @param {Object} sheet - The style sheet
                 * @param {number} index - the index of the rule
                 * @access private
                 */
                removeRule = function (sheet, index) {
                    if (sheet.deleteRule) {
                        sheet.deleteRule(index);
                    } else {
                        // IE < 9
                        sheet.removeRule(index);
                    }
                };

            return {
                /**
                 * @method Hyphenator~CSSEdit.setRule
                 * @desc
                 * Sets a CSS rule for a specified selector
                 * @access public
                 * @param {string} sel - Selector
                 * @param {string} rulesString - CSS-Rules
                 */
                setRule: function (sel, rulesString) {
                    var i, existingRule, cssText;
                    existingRule = findRule(sel);
                    if (!!existingRule) {
                        if (!!existingRule.rule.cssText) {
                            cssText = existingRule.rule.cssText;
                        } else {
                            // IE < 9
                            cssText = existingRule.rule.style.cssText.toLowerCase();
                        }
                        if (cssText !== sel + ' { ' + rulesString + ' }') {
                            //cssText of the found rule is not uniquely selector + rulesString,
                            if (cssText.indexOf(rulesString) !== -1) {
                                //maybe there are other rules or IE < 9
                                //clear existing def
                                existingRule.rule.style.visibility = '';
                            }
                            //add rule and register for later removal
                            i = addRule(sel, rulesString);
                            changes.push({sheet: sheet, index: i});
                        }
                    } else {
                        i = addRule(sel, rulesString);
                        changes.push({sheet: sheet, index: i});
                    }
                },
                /**
                 * @method Hyphenator~CSSEdit.clearChanges
                 * @desc
                 * Removes all changes Hyphenator has made from the StyleSheets
                 * @access public
                 */
                clearChanges: function () {
                    var change = changes.pop();
                    while (!!change) {
                        removeRule(change.sheet, change.index);
                        change = changes.pop();
                    }
                }
            };
        },

        /**
         * @member {string} Hyphenator~hyphen
         * @desc
         * A string containing the character for in-word-hyphenation
         * @default the soft hyphen
         * @access private
         * @see {@link Hyphenator.config}
         */
        hyphen = String.fromCharCode(173),

        /**
         * @member {string} Hyphenator~urlhyphen
         * @desc
         * A string containing the character for url/mail-hyphenation
         * @default the zero width space
         * @access private
         * @see {@link Hyphenator.config}
         * @see {@link Hyphenator~zeroWidthSpace}
         */
        urlhyphen = zeroWidthSpace,

        /**
         * @method Hyphenator~hyphenateURL
         * @desc
         * Puts {@link Hyphenator~urlhyphen} (default: zero width space) after each no-alphanumeric char that my be in a URL.
         * @param {string} url to hyphenate
         * @returns string the hyphenated URL
         * @access public
         */
        hyphenateURL = function (url) {
            var tmp = url.replace(/([:\/\.\?#&\-_,;!@]+)/gi, '$&' + urlhyphen),
                parts = tmp.split(urlhyphen),
                i;
            for (i = 0; i < parts.length; i += 1) {
                if (parts[i].length > (2 * min)) {
                    parts[i] = parts[i].replace(/(\w{3})(\w)/gi, "$1" + urlhyphen + "$2");
                }
            }
            if (parts[parts.length - 1] === "") {
                parts.pop();
            }
            return parts.join(urlhyphen);
        },

        /**
         * @member {boolean} Hyphenator~safeCopy
         * @desc
         * Defines wether work-around for copy issues is active or not
         * @default true
         * @access private
         * @see {@link Hyphenator.config}
         * @see {@link Hyphenator~registerOnCopy}
         */
        safeCopy = true,

        /**
         * @method Hyphenator~zeroTimeOut
         * @desc
         * defer execution of a function on the call stack
         * Analog to window.setTimeout(fn, 0) but without a clamped delay if postMessage is supported
         * @access private
         * @see {@link http://dbaron.org/log/20100309-faster-timeouts}
         */
        zeroTimeOut = (function () {
            if (window.postMessage && window.addEventListener) {
                return (function () {
                    var timeouts = [],
                        msg = "Hyphenator_zeroTimeOut_message",
                        setZeroTimeOut = function (fn) {
                            timeouts.push(fn);
                            window.postMessage(msg, "*");
                        },
                        handleMessage = function (event) {
                            if (event.source === window && event.data === msg) {
                                event.stopPropagation();
                                if (timeouts.length > 0) {
                                    //var efn = timeouts.shift();
                                    //efn();
                                    timeouts.shift()();
                                }
                            }
                        };
                    window.addEventListener("message", handleMessage, true);
                    return setZeroTimeOut;
                }());
            }
            return function (fn) {
                window.setTimeout(fn, 0);
            };
        }()),

        /**
         * @member {Object} Hyphenator~hyphRunFor
         * @desc
         * stores location.href for documents where run() has been executed
         * to warn when Hyphenator.run() executed multiple times
         * @access private
         * @see {@link Hyphenator~runWhenLoaded}
         */
        hyphRunFor = {},

        /**
         * @method Hyphenator~runWhenLoaded
         * @desc
         * A crossbrowser solution for the DOMContentLoaded-Event based on
         * <a href = "http://jquery.com/">jQuery</a>
         * I added some functionality: e.g. support for frames and iframes…
         * @param {Object} w the window-object
         * @param {function()} f the function to call when the document is ready
         * @access private
         */
        runWhenLoaded = function (w, f) {
            var toplevel,
                add = window.document.addEventListener ? 'addEventListener' : 'attachEvent',
                rem = window.document.addEventListener ? 'removeEventListener' : 'detachEvent',
                pre = window.document.addEventListener ? '' : 'on',

                init = function (context) {
                    if (hyphRunFor[context.location.href]) {
                        onWarning(new Error("Warning: multiple execution of Hyphenator.run() – This may slow down the script!"));
                    }
                    contextWindow = context || window;
                    f();
                    hyphRunFor[contextWindow.location.href] = true;
                },

                doScrollCheck = function () {
                    try {
                        // If IE is used, use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        w.document.documentElement.doScroll("left");
                    } catch (error) {
                        window.setTimeout(doScrollCheck, 1);
                        return;
                    }
                    //maybe modern IE fired DOMContentLoaded
                    if (!hyphRunFor[w.location.href]) {
                        documentLoaded = true;
                        init(w);
                    }
                },

                doOnEvent = function (e) {
                    var i, fl, haveAccess;
                    if (!!e && e.type === 'readystatechange' && w.document.readyState !== 'interactive' && w.document.readyState !== 'complete') {
                        return;
                    }

                    //DOM is ready/interactive, but frames may not be loaded yet!
                    //cleanup events
                    w.document[rem](pre + 'DOMContentLoaded', doOnEvent, false);
                    w.document[rem](pre + 'readystatechange', doOnEvent, false);

                    //check frames
                    fl = w.frames.length;
                    if (fl === 0 || !doFrames) {
                        //there are no frames!
                        //cleanup events
                        w[rem](pre + 'load', doOnEvent, false);
                        documentLoaded = true;
                        init(w);
                    } else if (doFrames && fl > 0) {
                        //we have frames, so wait for onload and then initiate runWhenLoaded recursevly for each frame:
                        if (!!e && e.type === 'load') {
                            //cleanup events
                            w[rem](pre + 'load', doOnEvent, false);
                            for (i = 0; i < fl; i += 1) {
                                haveAccess = undefined;
                                //try catch isn't enough for webkit
                                try {
                                    //opera throws only on document.toString-access
                                    haveAccess = w.frames[i].document.toString();
                                } catch (err) {
                                    haveAccess = undefined;
                                }
                                if (!!haveAccess) {
                                    runWhenLoaded(w.frames[i], f);
                                }
                            }
                            init(w);
                        }
                    }
                };
            if (documentLoaded || w.document.readyState === 'complete') {
                //Hyphenator has run already (documentLoaded is true) or
                //it has been loaded after onLoad
                documentLoaded = true;
                doOnEvent({type: 'load'});
            } else {
                //register events
                w.document[add](pre + 'DOMContentLoaded', doOnEvent, false);
                w.document[add](pre + 'readystatechange', doOnEvent, false);
                w[add](pre + 'load', doOnEvent, false);
                toplevel = false;
                try {
                    toplevel = !window.frameElement;
                } catch (ignore) {}
                if (toplevel && w.document.documentElement.doScroll) {
                    doScrollCheck(); //calls init()
                }
            }
        },

        /**
         * @method Hyphenator~getLang
         * @desc
         * Gets the language of an element. If no language is set, it may use the {@link Hyphenator~mainLanguage}.
         * @param {Object} el The first parameter is an DOM-Element-Object
         * @param {boolean} fallback The second parameter is a boolean to tell if the function should return the {@link Hyphenator~mainLanguage}
         * if there's no language found for the element.
         * @return {string} The language of the element
         * @access private
         */
        getLang = function (el, fallback) {
            try {
                return !!el.getAttribute('lang') ? el.getAttribute('lang').toLowerCase() :
                        !!el.getAttribute('xml:lang') ? el.getAttribute('xml:lang').toLowerCase() :
                                el.tagName.toLowerCase() !== 'html' ? getLang(el.parentNode, fallback) :
                                        fallback ? mainLanguage :
                                                null;
            } catch (ignore) {}
        },

        /**
         * @method Hyphenator~autoSetMainLanguage
         * @desc
         * Retrieves the language of the document from the DOM and sets the lang attribute of the html-tag.
         * The function looks in the following places:
         * <ul>
         * <li>lang-attribute in the html-tag</li>
         * <li>&lt;meta http-equiv = "content-language" content = "xy" /&gt;</li>
         * <li>&lt;meta name = "DC.Language" content = "xy" /&gt;</li>
         * <li>&lt;meta name = "language" content = "xy" /&gt;</li>
         * </li>
         * If nothing can be found a prompt using {@link Hyphenator~languageHint} and a prompt-string is displayed.
         * If the retrieved language is in the object {@link Hyphenator~supportedLangs} it is copied to {@link Hyphenator~mainLanguage}
         * @access private
         */
        autoSetMainLanguage = function (w) {
            w = w || contextWindow;
            var el = w.document.getElementsByTagName('html')[0],
                m = w.document.getElementsByTagName('meta'),
                i,
                getLangFromUser = function () {
                    var ml,
                        text = '',
                        dH = 300,
                        dW = 450,
                        dX = Math.floor((w.outerWidth - dW) / 2) + window.screenX,
                        dY = Math.floor((w.outerHeight - dH) / 2) + window.screenY,
                        ul = '',
                        languageHint;
                    if (!!window.showModalDialog && (w.location.href.indexOf(basePath) !== -1)) {
                        ml = window.showModalDialog(basePath + 'modalLangDialog.html', supportedLangs, "dialogWidth: " + dW + "px; dialogHeight: " + dH + "px; dialogtop: " + dY + "; dialogleft: " + dX + "; center: on; resizable: off; scroll: off;");
                    } else {
                        languageHint = (function () {
                            var k, r = '';
                            for (k in supportedLangs) {
                                if (supportedLangs.hasOwnProperty(k)) {
                                    r += k + ', ';
                                }
                            }
                            r = r.substring(0, r.length - 2);
                            return r;
                        }());
                        ul = window.navigator.language || window.navigator.userLanguage;
                        ul = ul.substring(0, 2);
                        if (!!supportedLangs[ul] && supportedLangs[ul].prompt !== '') {
                            text = supportedLangs[ul].prompt;
                        } else {
                            text = supportedLangs.en.prompt;
                        }
                        text += ' (ISO 639-1)\n\n' + languageHint;
                        ml = window.prompt(window.unescape(text), ul).toLowerCase();
                    }
                    return ml;
                };
            mainLanguage = getLang(el, false);
            if (!mainLanguage) {
                for (i = 0; i < m.length; i += 1) {
                    //<meta http-equiv = "content-language" content="xy">
                    if (!!m[i].getAttribute('http-equiv') && (m[i].getAttribute('http-equiv').toLowerCase() === 'content-language')) {
                        mainLanguage = m[i].getAttribute('content').toLowerCase();
                    }
                    //<meta name = "DC.Language" content="xy">
                    if (!!m[i].getAttribute('name') && (m[i].getAttribute('name').toLowerCase() === 'dc.language')) {
                        mainLanguage = m[i].getAttribute('content').toLowerCase();
                    }
                    //<meta name = "language" content = "xy">
                    if (!!m[i].getAttribute('name') && (m[i].getAttribute('name').toLowerCase() === 'language')) {
                        mainLanguage = m[i].getAttribute('content').toLowerCase();
                    }
                }
            }
            //get lang for frame from enclosing document
            if (!mainLanguage && doFrames && (!!contextWindow.frameElement)) {
                autoSetMainLanguage(window.parent);
            }
            //fallback to defaultLang if set
            if (!mainLanguage && defaultLanguage !== '') {
                mainLanguage = defaultLanguage;
            }
            //ask user for lang
            if (!mainLanguage) {
                mainLanguage = getLangFromUser();
            }
            el.lang = mainLanguage;
        },

        /**
         * @method Hyphenator~gatherDocumentInfos
         * @desc
         * This method runs through the DOM and executes the process()-function on:
         * - every node returned by the {@link Hyphenator~selectorFunction}.
         * @access private
         */
        gatherDocumentInfos = function () {
            var elToProcess, urlhyphenEls, tmp, i = 0,
                /**
                 * @method Hyphenator~gatherDocumentInfos
                 * @desc
                 * This method copies the element to the elements-variable, sets its visibility
                 * to intermediateState, retrieves its language and recursivly descends the DOM-tree until
                 * the child-Nodes aren't of type 1
                 * @param {Object} el a DOM element
                 * @param {string} plang the language of the parent element
                 * @param {boolean} isChild true, if the parent of el has been processed
                 */
                process = function (el, pLang, isChild) {
                    isChild = isChild || false;
                    var n, j = 0, hyphenate = true, eLang,
                        useCSS3 = function () {
                            css3hyphenateClassHandle =  new CSSEdit(contextWindow);
                            css3hyphenateClassHandle.setRule('.' + css3hyphenateClass, css3_h9n.property + ': auto;');
                            css3hyphenateClassHandle.setRule('.' + dontHyphenateClass, css3_h9n.property + ': manual;');
                            if ((eLang !== pLang) && css3_h9n.property.indexOf('webkit') !== -1) {
                                css3hyphenateClassHandle.setRule('.' + css3hyphenateClass, '-webkit-locale : ' + eLang + ';');
                            }
                            el.className = el.className + ' ' + css3hyphenateClass;
                        },
                        useHyphenator = function () {
                            //quick fix for test111.html
                            //better: weight elements
                            if (isBookmarklet && eLang !== mainLanguage) {
                                return;
                            }
                            if (supportedLangs.hasOwnProperty(eLang)) {
                                docLanguages[eLang] = true;
                            } else {
                                if (supportedLangs.hasOwnProperty(eLang.split('-')[0])) { //try subtag
                                    eLang = eLang.split('-')[0];
                                    docLanguages[eLang] = true;
                                } else if (!isBookmarklet) {
                                    hyphenate = false;
                                    onError(new Error('Language "' + eLang + '" is not yet supported.'));
                                }
                            }
                            if (hyphenate) {
                                if (intermediateState === 'hidden') {
                                    el.className = el.className + ' ' + hideClass;
                                }
                                elements.add(el, eLang);
                            }
                        };

                    if (el.lang && typeof (el.lang) === 'string') {
                        eLang = el.lang.toLowerCase(); //copy attribute-lang to internal eLang
                    } else if (!!pLang && pLang !== '') {
                        eLang = pLang.toLowerCase();
                    } else {
                        eLang = getLang(el, true);
                    }

                    if (!isChild) {
                        if (css3 && css3_h9n.support && !!css3_h9n.checkLangSupport(eLang)) {
                            useCSS3();
                        } else {
                            useHyphenator();
                        }
                    } else {
                        if (eLang !== pLang) {
                            if (css3 && css3_h9n.support && !!css3_h9n.checkLangSupport(eLang)) {
                                useCSS3();
                            } else {
                                useHyphenator();
                            }
                        } else {
                            if (!css3 || !css3_h9n.support || !css3_h9n.checkLangSupport(eLang)) {
                                useHyphenator();
                            } // else do nothing
                        }
                    }
                    n = el.childNodes[j];
                    while (!!n) {
                        if (n.nodeType === 1 && !dontHyphenate[n.nodeName.toLowerCase()] &&
                                n.className.indexOf(dontHyphenateClass) === -1 &&
                                n.className.indexOf(urlHyphenateClass) === -1 && !elToProcess[n]) {
                            process(n, eLang, true);
                        }
                        j += 1;
                        n = el.childNodes[j];
                    }
                },
                processUrlStyled = function (el) {
                    var n, j = 0;

                    n = el.childNodes[j];
                    while (!!n) {
                        if (n.nodeType === 1 && !dontHyphenate[n.nodeName.toLowerCase()] &&
                                n.className.indexOf(dontHyphenateClass) === -1 &&
                                n.className.indexOf(hyphenateClass) === -1 && !urlhyphenEls[n]) {
                            processUrlStyled(n);
                        } else if (n.nodeType === 3) {
                            n.data = hyphenateURL(n.data);
                        }
                        j += 1;
                        n = el.childNodes[j];
                    }
                };

            if (css3) {
                css3_gethsupport();
            }
            if (isBookmarklet) {
                elToProcess = contextWindow.document.getElementsByTagName('body')[0];
                process(elToProcess, mainLanguage, false);
            } else {
                if (!css3 && intermediateState === 'hidden') {
                    CSSEditors.push(new CSSEdit(contextWindow));
                    CSSEditors[CSSEditors.length - 1].setRule('.' + hyphenateClass, 'visibility: hidden;');
                    CSSEditors[CSSEditors.length - 1].setRule('.' + hideClass, 'visibility: hidden;');
                    CSSEditors[CSSEditors.length - 1].setRule('.' + unhideClass, 'visibility: visible;');
                }
                elToProcess = selectElements();
                tmp = elToProcess[i];
                while (!!tmp) {
                    process(tmp, '', false);
                    i += 1;
                    tmp = elToProcess[i];
                }

                urlhyphenEls = mySelectorFunction(urlHyphenateClass);
                i = 0;
                tmp = urlhyphenEls[i];
                while (!!tmp) {
                    processUrlStyled(tmp);
                    i += 1;
                    tmp = urlhyphenEls[i];
                }
            }
            if (elements.count === 0) {
                //nothing to hyphenate or all hyphenated by css3
                for (i = 0; i < CSSEditors.length; i += 1) {
                    CSSEditors[i].clearChanges();
                }
                onHyphenationDone(contextWindow.location.href);
            }
        },

        /**
         * @method Hyphenator~createCharMap
         * @desc
         * reads the charCodes from lo.characters and stores them in a bidi map:
         * charMap.int2code =  [0: 97, //a
         *                      1: 98, //b
         *                      2: 99] //c etc.
         * charMap.code2int = {"97": 0, //a
         *                     "98": 1, //b
         *                     "99": 2} //c etc.
         * @access private
         * @param {Object} language object
         */
        CharMap = function () {
            this.int2code = [];
            this.code2int = {};
            this.add = function (newValue) {
                if (!this.code2int[newValue]) {
                    this.int2code.push(newValue);
                    this.code2int[newValue] = this.int2code.length - 1;
                }
            };
        },

        /**
         * @constructor Hyphenator~ValueStore
         * @desc Storage-Object for storing hyphenation points (aka values)
         * @access private
         */
        ValueStore = function (len) {
            var startIndex = 1,
                actualIndex = 2,
                lastValueIndex = 2;
            this.keys = (function () {
                var i, r;
                if (Object.prototype.hasOwnProperty.call(window, "Uint8Array")) { //IE<9 doesn't have window.hasOwnProperty (host object)
                    return new window.Uint8Array(len);
                }
                r = [];
                r.length = len;
                for (i = r.length - 1; i >= 0; i -= 1) {
                    r[i] = 0;
                }
                return r;
            }());
            this.add = function (p) {
                this.keys[actualIndex] = p;
                lastValueIndex = actualIndex;
                actualIndex += 1;
            };
            this.add0 = function () {
                //just do a step, since array is initialized with zeroes
                actualIndex += 1;
            };
            this.finalize = function () {
                var start = startIndex;
                this.keys[start] = lastValueIndex - start;
                startIndex = lastValueIndex + 1;
                actualIndex = lastValueIndex + 2;
                return start;
            };
        },

        /**
         * @method Hyphenator~convertPatternsToArray
         * @desc
         * converts the patterns to a (typed, if possible) array as described by Liang:
         *
         * 1. Create the CharMap: an alphabet of used character codes mapped to an int (e.g. a: "97" -> 0)
         *    This map is bidirectional:
         *    charMap.code2int is an object with charCodes as keys and corresponging ints as values
         *    charMao.int2code is an array of charCodes at int indizes
         *    the length of charMao.int2code is equal the length of the alphabet
         *
         * 2. Create a ValueStore: (typed) array that holds "values", i.e. the digits extracted from the patterns
         *    The first value starts at index 1 (since the trie is initialized with zeroes, starting at 0 would create errors)
         *    Each value starts with its length at index i, actual values are stored in i + n where n < length
         *    Trailing 0 are not stored. So pattern values like e.g. "010200" will become […,4,0,1,0,2,…]
         *    The ValueStore-Object manages handling of indizes automatically. Use ValueStore.add(p) to add a running value.
         *    Use ValueStore.finalize() when the last value of a pattern is added. It will set the length and return the starting index of the pattern.
         *    To prevent doubles we could temporarly store the values in a object {value: startIndex} and only add new values,
         *    but this object deoptimizes very fast (new hidden map for each entry); here we gain speed and pay memory
         *    
         * 3. Create and zero initialize a (typed) array to store the trie. The trie uses two slots for each entry/node:
         *    i: a link to another position in the array or -1 if the pattern ends here or more rows have to be added.
         *    i + 1: a link to a value in the ValueStore or 0 if there's no value for the path to this node.
         *    Although the array is one-dimensional it can be described as an array of "rows",
         *    where each "row" is an array of length trieRowLength (see below).
         *    The first entry of this "row" represents the first character of the alphabet, the second a possible link to value store,
         *    the third represents the second character of the alphabet and so on…
         *
         * 4. Initialize trieRowLength (length of the alphabet * 2)
         *
         * 5. Now we apply extract to each pattern collection (patterns of the same length are collected and concatenated to one string)
         *    extract goes through these pattern collections char by char and adds them either to the ValueStore (if they are digits) or
         *    to the trie (adding more "rows" if necessary, i.e. if the last link pointed to -1).
         *    So the first "row" holds all starting characters, where the subsequent rows hold the characters that follow the
         *    character that link to this row. Therefor the array is dense at the beginning and very sparse at the end.
         * 
         * 
         * @access private
         * @param {Object} language object
         */
        convertPatternsToArray = function (lo) {
            var trieNextEmptyRow = 0,
                i,
                charMapc2i,
                valueStore,
                indexedTrie,
                trieRowLength,

                extract = function (patternSizeInt, patterns) {
                    var charPos = 0,
                        charCode = 0,
                        mappedCharCode = 0,
                        rowStart = 0,
                        nextRowStart = 0,
                        prevWasDigit = false;
                    for (charPos = 0; charPos < patterns.length; charPos += 1) {
                        charCode = patterns.charCodeAt(charPos);
                        if ((charPos + 1) % patternSizeInt !== 0) {
                            //more to come…
                            if (charCode <= 57 && charCode >= 49) {
                                //charCode is a digit
                                valueStore.add(charCode - 48);
                                prevWasDigit = true;
                            } else {
                                //charCode is alphabetical
                                if (!prevWasDigit) {
                                    valueStore.add0();
                                }
                                prevWasDigit = false;
                                if (nextRowStart === -1) {
                                    nextRowStart = trieNextEmptyRow + trieRowLength;
                                    trieNextEmptyRow = nextRowStart;
                                    indexedTrie[rowStart + mappedCharCode * 2] = nextRowStart;
                                }
                                mappedCharCode = charMapc2i[charCode];
                                rowStart = nextRowStart;
                                nextRowStart = indexedTrie[rowStart + mappedCharCode * 2];
                                if (nextRowStart === 0) {
                                    indexedTrie[rowStart + mappedCharCode * 2] = -1;
                                    nextRowStart = -1;
                                }
                            }
                        } else {
                            //last part of pattern
                            if (charCode <= 57 && charCode >= 49) {
                                //the last charCode is a digit
                                valueStore.add(charCode - 48);
                                indexedTrie[rowStart + mappedCharCode * 2 + 1] = valueStore.finalize();
                            } else {
                                //the last charCode is alphabetical
                                if (!prevWasDigit) {
                                    valueStore.add0();
                                }
                                valueStore.add0();
                                if (nextRowStart === -1) {
                                    nextRowStart = trieNextEmptyRow + trieRowLength;
                                    trieNextEmptyRow = nextRowStart;
                                    indexedTrie[rowStart + mappedCharCode * 2] = nextRowStart;
                                }
                                mappedCharCode = charMapc2i[charCode];
                                rowStart = nextRowStart;
                                if (indexedTrie[rowStart + mappedCharCode * 2] === 0) {
                                    indexedTrie[rowStart + mappedCharCode * 2] = -1;
                                }
                                indexedTrie[rowStart + mappedCharCode * 2 + 1] = valueStore.finalize();
                            }
                            rowStart = 0;
                            nextRowStart = 0;
                            prevWasDigit = false;
                        }
                    }
                };/*,
                prettyPrintIndexedTrie = function (rowLength) {
                    var s = "0: ",
                        idx;
                    for (idx = 0; idx < indexedTrie.length; idx += 1) {
                        s += indexedTrie[idx];
                        s += ",";
                        if ((idx + 1) % rowLength === 0) {
                            s += "\n" + (idx + 1) + ": ";
                        }
                    }
                    console.log(s);
                };*/

            lo.charMap = new CharMap();
            for (i = 0; i < lo.patternChars.length; i += 1) {
                lo.charMap.add(lo.patternChars.charCodeAt(i));
            }
            charMapc2i = lo.charMap.code2int;

            lo.valueStore = valueStore = new ValueStore(lo.valueStoreLength);

            if (Object.prototype.hasOwnProperty.call(window, "Int32Array")) { //IE<9 doesn't have window.hasOwnProperty (host object)
                lo.indexedTrie = new window.Int32Array(lo.patternArrayLength * 2);
            } else {
                lo.indexedTrie = [];
                lo.indexedTrie.length = lo.patternArrayLength * 2;
                for (i = lo.indexedTrie.length - 1; i >= 0; i -= 1) {
                    lo.indexedTrie[i] = 0;
                }
            }
            indexedTrie = lo.indexedTrie;
            trieRowLength = lo.charMap.int2code.length * 2;

            for (i in lo.patterns) {
                if (lo.patterns.hasOwnProperty(i)) {
                    extract(parseInt(i, 10), lo.patterns[i]);
                }
            }
            //prettyPrintIndexedTrie(lo.charMap.int2code.length * 2);
        },

        /**
         * @method Hyphenator~recreatePattern
         * @desc
         * Recreates the pattern for the reducedPatternSet
         * @param {string} pattern The pattern (chars)
         * @param {string} nodePoints The nodePoints (integers)
         * @access private
         * @return {string} The pattern (chars and numbers)
         */
        recreatePattern = function (pattern, nodePoints) {
            var r = [], c = pattern.split(''), i;
            for (i = 0; i <= c.length; i += 1) {
                if (nodePoints[i] && nodePoints[i] !== 0) {
                    r.push(nodePoints[i]);
                }
                if (c[i]) {
                    r.push(c[i]);
                }
            }
            return r.join('');
        },

        /**
         * @method Hyphenator~convertExceptionsToObject
         * @desc
         * Converts a list of comma seprated exceptions to an object:
         * 'Fortran,Hy-phen-a-tion' -> {'Fortran':'Fortran','Hyphenation':'Hy-phen-a-tion'}
         * @access private
         * @param {string} exc a comma separated string of exceptions (without spaces)
         * @return {Object.<string, string>}
         */
        convertExceptionsToObject = function (exc) {
            var w = exc.split(', '),
                r = {},
                i,
                l,
                key;
            for (i = 0, l = w.length; i < l; i += 1) {
                key = w[i].replace(/-/g, '');
                if (!r.hasOwnProperty(key)) {
                    r[key] = w[i];
                }
            }
            return r;
        },

        /**
         * @method Hyphenator~loadPatterns
         * @desc
         * Checks if the requested file is available in the network.
         * Adds a &lt;script&gt;-Tag to the DOM to load an externeal .js-file containing patterns and settings for the given language.
         * If the given language is not in the {@link Hyphenator~supportedLangs}-Object it returns.
         * One may ask why we are not using AJAX to load the patterns. The XMLHttpRequest-Object 
         * has a same-origin-policy. This makes the Bookmarklet impossible.
         * @param {string} lang The language to load the patterns for
         * @access private
         * @see {@link Hyphenator~basePath}
         */
        loadPatterns = function (lang, cb) {
            var location, xhr, head, script, done = false;
            if (supportedLangs.hasOwnProperty(lang) && !Hyphenator.languages[lang]) {
                location = basePath + 'patterns/' + supportedLangs[lang].file;
            } else {
                return;
            }
            if (isLocal && !isBookmarklet) {
                //check if 'location' is available:
                xhr = null;
                try {
                    // Mozilla, Opera, Safari and Internet Explorer (ab v7)
                    xhr = new window.XMLHttpRequest();
                } catch (e) {
                    try {
                        //IE>=6
                        xhr  = new window.ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e2) {
                        try {
                            //IE>=5
                            xhr  = new window.ActiveXObject("Msxml2.XMLHTTP");
                        } catch (e3) {
                            xhr  = null;
                        }
                    }
                }

                if (xhr) {
                    xhr.open('HEAD', location, true);
                    xhr.setRequestHeader('Cache-Control', 'no-cache');
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 2) {
                            if (xhr.status >= 400) {
                                onError(new Error('Could not load\n' + location));
                                delete docLanguages[lang];
                                return;
                            }
                            xhr.abort();
                        }
                    };
                    xhr.send(null);
                }
            }
            if (createElem) {
                head = window.document.getElementsByTagName('head').item(0);
                script = createElem('script', window);
                script.src = location;
                script.type = 'text/javascript';
                script.charset = 'utf8';
                script.onload = script.onreadystatechange = function () {
                    if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                        done = true;

                        cb();

                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;
                        if (head && script.parentNode) {
                            head.removeChild(script);
                        }
                    }
                };
                head.appendChild(script);
            }
        },

        /**
         * @method Hyphenator~prepareLanguagesObj
         * @desc
         * Adds some feature to the language object:
         * - cache
         * - exceptions
         * Converts the patterns to a trie using {@link Hyphenator~convertPatterns}
         * @access private
         * @param {string} lang The language of the language object
         */
        prepareLanguagesObj = function (lang) {
            var lo = Hyphenator.languages[lang], wrd;

            if (!lo.prepared) {
                if (enableCache) {
                    lo.cache = {};
                    //Export
                    //lo['cache'] = lo.cache;
                }
                if (enableReducedPatternSet) {
                    lo.redPatSet = {};
                }
                //add exceptions from the pattern file to the local 'exceptions'-obj
                if (lo.hasOwnProperty('exceptions')) {
                    Hyphenator.addExceptions(lang, lo.exceptions);
                    delete lo.exceptions;
                }
                //copy global exceptions to the language specific exceptions
                if (exceptions.hasOwnProperty('global')) {
                    if (exceptions.hasOwnProperty(lang)) {
                        exceptions[lang] += ', ' + exceptions.global;
                    } else {
                        exceptions[lang] = exceptions.global;
                    }
                }
                //move exceptions from the the local 'exceptions'-obj to the 'language'-object
                if (exceptions.hasOwnProperty(lang)) {
                    lo.exceptions = convertExceptionsToObject(exceptions[lang]);
                    delete exceptions[lang];
                } else {
                    lo.exceptions = {};
                }
                convertPatternsToArray(lo);
                if (String.prototype.normalize) {
                    wrd = '[\\w' + lo.specialChars + lo.specialChars.normalize("NFD") + String.fromCharCode(173) + String.fromCharCode(8204) + '-]{' + min + ',}';
                } else {
                    wrd = '[\\w' + lo.specialChars + String.fromCharCode(173) + String.fromCharCode(8204) + '-]{' + min + ',}';
                }
                lo.genRegExp = new RegExp('(' + wrd + ')|(' + url + ')|(' + mail + ')', 'gi');
                lo.prepared = true;
            }
        },

        /****
         * @method Hyphenator~prepare
         * @desc
         * This funtion prepares the Hyphenator~Object: If RemoteLoading is turned off, it assumes
         * that the patternfiles are loaded, all conversions are made and the callback is called.
         * If storage is active the object is retrieved there.
         * If RemoteLoading is on (default), it loads the pattern files and repeatedly checks Hyphenator.languages.
         * If a patternfile is loaded the patterns are stored in storage (if enabled),
         * converted to their object style and the lang-object extended.
         * Finally the callback is called.
         * @access private
         */
        prepare = function (callback) {
            var lang, tmp1, tmp2,
                languagesLoaded = function () {
                    var l;
                    for (l in docLanguages) {
                        if (docLanguages.hasOwnProperty(l)) {
                            if (Hyphenator.languages.hasOwnProperty(l)) {
                                delete docLanguages[l];
                                if (!!storage) {
                                    storage.setItem(l, window.JSON.stringify(Hyphenator.languages[l]));
                                }
                                prepareLanguagesObj(l);
                                callback(l);
                            }
                        }
                    }
                };

            if (!enableRemoteLoading) {
                for (lang in Hyphenator.languages) {
                    if (Hyphenator.languages.hasOwnProperty(lang)) {
                        prepareLanguagesObj(lang);
                    }
                }
                callback('*');
                return;
            }
            // get all languages that are used and preload the patterns
            for (lang in docLanguages) {
                if (docLanguages.hasOwnProperty(lang)) {
                    if (!!storage && storage.test(lang)) {
                        Hyphenator.languages[lang] = window.JSON.parse(storage.getItem(lang));
                        prepareLanguagesObj(lang);
                        if (exceptions.hasOwnProperty('global')) {
                            tmp1 = convertExceptionsToObject(exceptions.global);
                            for (tmp2 in tmp1) {
                                if (tmp1.hasOwnProperty(tmp2)) {
                                    Hyphenator.languages[lang].exceptions[tmp2] = tmp1[tmp2];
                                }
                            }
                        }
                        //Replace exceptions since they may have been changed:
                        if (exceptions.hasOwnProperty(lang)) {
                            tmp1 = convertExceptionsToObject(exceptions[lang]);
                            for (tmp2 in tmp1) {
                                if (tmp1.hasOwnProperty(tmp2)) {
                                    Hyphenator.languages[lang].exceptions[tmp2] = tmp1[tmp2];
                                }
                            }
                            delete exceptions[lang];
                        }
                        //Replace genRegExp since it may have been changed:
                        if (String.prototype.normalize) {
                            tmp1 = '[\\w' + Hyphenator.languages[lang].specialChars + Hyphenator.languages[lang].specialChars.normalize("NFD") + String.fromCharCode(173) + String.fromCharCode(8204) + '-]{' + min + ',}';
                        } else {
                            tmp1 = '[\\w' + Hyphenator.languages[lang].specialChars + String.fromCharCode(173) + String.fromCharCode(8204) + '-]{' + min + ',}';
                        }
                        Hyphenator.languages[lang].genRegExp = new RegExp('(' + tmp1 + ')|(' + url + ')|(' + mail + ')', 'gi');
                        if (enableCache) {
                            if (!Hyphenator.languages[lang].cache) {
                                Hyphenator.languages[lang].cache = {};
                            }
                        }
                        delete docLanguages[lang];
                        callback(lang);
                    } else {
                        loadPatterns(lang, languagesLoaded);
                    }
                }
            }
            //call languagesLoaded in case language has been loaded manually
            //and remoteLoading is on (onload won't fire)
            languagesLoaded();
        },

        /**
         * @method Hyphenator~toggleBox
         * @desc
         * Creates the toggleBox: a small button to turn off/on hyphenation on a page.
         * @see {@link Hyphenator.config}
         * @access private
         */
        toggleBox = function () {
            var bdy, myTextNode,
                text = (Hyphenator.doHyphenation ? 'Hy-phen-a-tion' : 'Hyphenation'),
                myBox = contextWindow.document.getElementById('HyphenatorToggleBox');
            if (!!myBox) {
                myBox.firstChild.data = text;
            } else {
                bdy = contextWindow.document.getElementsByTagName('body')[0];
                myBox = createElem('div', contextWindow);
                myBox.setAttribute('id', 'HyphenatorToggleBox');
                myBox.setAttribute('class', dontHyphenateClass);
                myTextNode = contextWindow.document.createTextNode(text);
                myBox.appendChild(myTextNode);
                myBox.onclick =  Hyphenator.toggleHyphenation;
                myBox.style.position = 'absolute';
                myBox.style.top = '0px';
                myBox.style.right = '0px';
                myBox.style.zIndex = '1000';
                myBox.style.margin = '0';
                myBox.style.backgroundColor = '#AAAAAA';
                myBox.style.color = '#FFFFFF';
                myBox.style.font = '6pt Arial';
                myBox.style.letterSpacing = '0.2em';
                myBox.style.padding = '3px';
                myBox.style.cursor = 'pointer';
                myBox.style.WebkitBorderBottomLeftRadius = '4px';
                myBox.style.MozBorderRadiusBottomleft = '4px';
                myBox.style.borderBottomLeftRadius = '4px';
                bdy.appendChild(myBox);
            }
        },

        /**
         * @method Hyphenator~doCharSubst
         * @desc
         * Replace chars in a word
         *
         * @param {Object} loCharSubst Map of substitutions ({'ä': 'a', 'ü': 'u', …})
         * @param {string} w the word
         * @returns string The word with substituted characers
         * @access private
         */
        doCharSubst = function (loCharSubst, w) {
            var subst, r;
            for (subst in loCharSubst) {
                if (loCharSubst.hasOwnProperty(subst)) {
                    r = w.replace(new RegExp(subst, 'g'), loCharSubst[subst]);
                }
            }
            return r;
        },

        /**
         * @member {Array} Hyphenator~wwAsMappedCharCodeStore
         * @desc
         * Array (typed if supported) container for charCodes
         * @access private
         * @see {@link Hyphenator~hyphenateWord}
         */
        wwAsMappedCharCodeStore = (function () {
            if (Object.prototype.hasOwnProperty.call(window, "Int32Array")) {
                return new window.Int32Array(64);
            }
            return [];
        }()),

        /**
         * @member {Array} Hyphenator~wwhpStore
         * @desc
         * Array (typed if supported) container for hyphenation points
         * @access private
         * @see {@link Hyphenator~hyphenateWord}
         */
        wwhpStore = (function () {
            var r;
            if (Object.prototype.hasOwnProperty.call(window, "Uint8Array")) {
                r = new window.Uint8Array(64);
            } else {
                r = [];
            }
            return r;
        }()),

        /**
         * @method Hyphenator~hyphenateWord
         * @desc
         * This function is the heart of Hyphenator.js. It returns a hyphenated word.
         *
         * If there's already a {@link Hyphenator~hypen} in the word, the word is returned as it is.
         * If the word is in the exceptions list or in the cache, it is retrieved from it.
         * If there's a '-' hyphenate the parts.
         * The hyphenated word is returned and (if acivated) cached.
         * Both special Events onBeforeWordHyphenation and onAfterWordHyphenation are called for the word.
         * @param {Object} lo A language object (containing the patterns)
         * @param {string} lang The language of the word
         * @param {string} word The word
         * @returns string The hyphenated word
         * @access private
         */
        hyphenateWord = function (lo, lang, word) {
            var parts,
                i,
                pattern = "",
                ww,
                wwlen,
                wwhp = wwhpStore,
                pstart,
                plen,
                hp,
                wordLength = word.length,
                hw = '',
                charMap = lo.charMap.code2int,
                charCode,
                mappedCharCode,
                row = 0,
                link = 0,
                value = 0,
                values,
                indexedTrie = lo.indexedTrie,
                valueStore = lo.valueStore.keys,
                wwAsMappedCharCode = wwAsMappedCharCodeStore;

            word = onBeforeWordHyphenation(word, lang);
            if (word === '') {
                hw = '';
            } else if (enableCache && lo.cache && lo.cache.hasOwnProperty(word)) { //the word is in the cache
                hw = lo.cache[word];
            } else if (word.indexOf(hyphen) !== -1) {
                //word already contains shy; -> leave at it is!
                hw = word;
            } else if (lo.exceptions.hasOwnProperty(word)) { //the word is in the exceptions list
                hw = lo.exceptions[word].replace(/-/g, hyphen);
            } else if (word.indexOf('-') !== -1) {
                //word contains '-' -> hyphenate the parts separated with '-'
                parts = word.split('-');
                for (i = 0; i < parts.length; i += 1) {
                    parts[i] = hyphenateWord(lo, lang, parts[i]);
                }
                hw = parts.join('-');
            } else {
                ww = word.toLowerCase();
                if (String.prototype.normalize) {
                    ww = ww.normalize("NFC");
                }
                if (lo.hasOwnProperty("charSubstitution")) {
                    ww = doCharSubst(lo.charSubstitution, ww);
                }
                if (word.indexOf("'") !== -1) {
                    ww = ww.replace(/'/g, "’"); //replace APOSTROPHE with RIGHT SINGLE QUOTATION MARK (since the latter is used in the patterns)
                }
                ww = '_' + ww + '_';
                wwlen = ww.length;
                //prepare wwhp and wwAsMappedCharCode
                for (pstart = 0; pstart < wwlen; pstart += 1) {
                    wwhp[pstart] = 0;
                    charCode = ww.charCodeAt(pstart);
                    if (charMap[charCode] !== undefined) {
                        wwAsMappedCharCode[pstart] = charMap[charCode];
                    } else {
                        wwAsMappedCharCode[pstart] = -1;
                    }
                }
                //get hyphenation points for all substrings
                for (pstart = 0; pstart < wwlen; pstart += 1) {
                    row = 0;
                    pattern = '';
                    for (plen = pstart; plen < wwlen; plen += 1) {
                        mappedCharCode = wwAsMappedCharCode[plen];
                        if (mappedCharCode === -1) {
                            break;
                        }
                        if (enableReducedPatternSet) {
                            pattern += ww.charAt(plen);
                        }
                        link = indexedTrie[row + mappedCharCode * 2];
                        value = indexedTrie[row + mappedCharCode * 2 + 1];
                        if (value > 0) {
                            hp = valueStore[value];
                            while (hp) {
                                hp -= 1;
                                if (valueStore[value + 1 + hp] > wwhp[pstart + hp]) {
                                    wwhp[pstart + hp] = valueStore[value + 1 + hp];
                                }
                            }
                            if (enableReducedPatternSet) {
                                if (!lo.redPatSet) {
                                    lo.redPatSet = {};
                                }
                                if (valueStore.subarray) {
                                    values = valueStore.subarray(value + 1, value + 1 + valueStore[value]);
                                } else {
                                    values = valueStore.slice(value + 1, value + 1 + valueStore[value]);
                                }
                                lo.redPatSet[pattern] = recreatePattern(pattern, values);
                            }
                        }
                        if (link > 0) {
                            row = link;
                        } else {
                            break;
                        }
                    }
                }
                //create hyphenated word
                for (hp = 0; hp < wordLength; hp += 1) {
                    if (hp >= lo.leftmin && hp <= (wordLength - lo.rightmin) && (wwhp[hp + 1] % 2) !== 0) {
                        hw += hyphen + word.charAt(hp);
                    } else {
                        hw += word.charAt(hp);
                    }
                }
            }
            hw = onAfterWordHyphenation(hw, lang);
            if (enableCache) { //put the word in the cache
                lo.cache[word] = hw;
            }
            return hw;
        },

        /**
         * @method Hyphenator~removeHyphenationFromElement
         * @desc
         * Removes all hyphens from the element. If there are other elements, the function is
         * called recursively.
         * Removing hyphens is usefull if you like to copy text. Some browsers are buggy when the copy hyphenated texts.
         * @param {Object} el The element where to remove hyphenation.
         * @access public
         */
        removeHyphenationFromElement = function (el) {
            var h, u, i = 0, n;
            switch (hyphen) {
            case '|':
                h = '\\|';
                break;
            case '+':
                h = '\\+';
                break;
            case '*':
                h = '\\*';
                break;
            default:
                h = hyphen;
            }
            switch (urlhyphen) {
            case '|':
                u = '\\|';
                break;
            case '+':
                u = '\\+';
                break;
            case '*':
                u = '\\*';
                break;
            default:
                u = urlhyphen;
            }
            n = el.childNodes[i];
            while (!!n) {
                if (n.nodeType === 3) {
                    n.data = n.data.replace(new RegExp(h, 'g'), '');
                    n.data = n.data.replace(new RegExp(u, 'g'), '');
                } else if (n.nodeType === 1) {
                    removeHyphenationFromElement(n);
                }
                i += 1;
                n = el.childNodes[i];
            }
        },

        copy = (function () {
            var Copy = function () {

                this.oncopyHandler = function (e) {
                    e = e || window.event;
                    var shadow, selection, range, rangeShadow, restore,
                        target = e.target || e.srcElement,
                        currDoc = target.ownerDocument,
                        bdy = currDoc.getElementsByTagName('body')[0],
                        targetWindow = currDoc.defaultView || currDoc.parentWindow;
                    if (target.tagName && dontHyphenate[target.tagName.toLowerCase()]) {
                        //Safari needs this
                        return;
                    }
                    //create a hidden shadow element
                    shadow = currDoc.createElement('div');
                    //Moving the element out of the screen doesn't work for IE9 (https://connect.microsoft.com/IE/feedback/details/663981/)
                    //shadow.style.overflow = 'hidden';
                    //shadow.style.position = 'absolute';
                    //shadow.style.top = '-5000px';
                    //shadow.style.height = '1px';
                    //doing this instead:
                    shadow.style.color = window.getComputedStyle ? targetWindow.getComputedStyle(bdy, null).backgroundColor : '#FFFFFF';
                    shadow.style.fontSize = '0px';
                    bdy.appendChild(shadow);
                    if (!!window.getSelection) {
                        //FF3, Webkit, IE9
                        e.stopPropagation();
                        selection = targetWindow.getSelection();
                        range = selection.getRangeAt(0);
                        shadow.appendChild(range.cloneContents());
                        removeHyphenationFromElement(shadow);
                        selection.selectAllChildren(shadow);
                        restore = function () {
                            shadow.parentNode.removeChild(shadow);
                            selection.removeAllRanges(); //IE9 needs that
                            selection.addRange(range);
                        };
                    } else {
                        // IE<9
                        e.cancelBubble = true;
                        selection = targetWindow.document.selection;
                        range = selection.createRange();
                        shadow.innerHTML = range.htmlText;
                        removeHyphenationFromElement(shadow);
                        rangeShadow = bdy.createTextRange();
                        rangeShadow.moveToElementText(shadow);
                        rangeShadow.select();
                        restore = function () {
                            shadow.parentNode.removeChild(shadow);
                            if (range.text !== "") {
                                range.select();
                            }
                        };
                    }
                    zeroTimeOut(restore);
                };

                this.removeOnCopy = function (el) {
                    var body = el.ownerDocument.getElementsByTagName('body')[0];
                    if (!body) {
                        return;
                    }
                    el = el || body;
                    if (window.removeEventListener) {
                        el.removeEventListener("copy", this.oncopyHandler, true);
                    } else {
                        el.detachEvent("oncopy", this.oncopyHandler);
                    }
                };

                this.registerOnCopy = function (el) {
                    var body = el.ownerDocument.getElementsByTagName('body')[0];
                    if (!body) {
                        return;
                    }
                    el = el || body;
                    if (window.addEventListener) {
                        el.addEventListener("copy", this.oncopyHandler, true);
                    } else {
                        el.attachEvent("oncopy", this.oncopyHandler);
                    }
                };
            };

            return (safeCopy ? new Copy() : false);
        }()),


        /**
         * @method Hyphenator~checkIfAllDone
         * @desc
         * Checks if all elements in {@link Hyphenator~elements} are hyphenated, unhides them and fires onHyphenationDone()
         * @access private
         */
        checkIfAllDone = function () {
            var allDone = true, i, doclist = {}, doc;
            elements.each(function (ellist) {
                var j, l = ellist.length;
                for (j = 0; j < l; j += 1) {
                    allDone = allDone && ellist[j].hyphenated;
                    if (!doclist.hasOwnProperty(ellist[j].element.baseURI)) {
                        doclist[ellist[j].element.ownerDocument.location.href] = true;
                    }
                    doclist[ellist[j].element.ownerDocument.location.href] = doclist[ellist[j].element.ownerDocument.location.href] && ellist[j].hyphenated;
                }
            });
            if (allDone) {
                if (intermediateState === 'hidden' && unhide === 'progressive') {
                    elements.each(function (ellist) {
                        var j, l = ellist.length, el;
                        for (j = 0; j < l; j += 1) {
                            el = ellist[j].element;
                            el.className = el.className.replace(unhideClassRegExp, '');
                            if (el.className === '') {
                                el.removeAttribute('class');
                            }
                        }
                    });
                }
                for (i = 0; i < CSSEditors.length; i += 1) {
                    CSSEditors[i].clearChanges();
                }
                for (doc in doclist) {
                    if (doclist.hasOwnProperty(doc) && doc === contextWindow.location.href) {
                        onHyphenationDone(doc);
                    }
                }
                if (!!storage && storage.deferred.length > 0) {
                    for (i = 0; i < storage.deferred.length; i += 1) {
                        storage.deferred[i].call();
                    }
                    storage.deferred = [];
                }
            }
        },

        /**
         * @method Hyphenator~controlOrphans
         * @desc
         * removes orphans depending on the 'orphanControl'-setting:
         * orphanControl === 1: do nothing
         * orphanControl === 2: prevent last word to be hyphenated
         * orphanControl === 3: prevent one word on a last line (inserts a nobreaking space)
         * @param {string} part - The sring where orphans have to be removed
         * @access private
         */
        controlOrphans = function (part) {
            var h, r;
            switch (hyphen) {
            case '|':
                h = '\\|';
                break;
            case '+':
                h = '\\+';
                break;
            case '*':
                h = '\\*';
                break;
            default:
                h = hyphen;
            }
            //strip off blank space at the end (omitted closing tags)
            part = part.replace(/[\s]*$/, '');
            if (orphanControl >= 2) {
                //remove hyphen points from last word
                r = part.split(' ');
                r[1] = r[1].replace(new RegExp(h, 'g'), '');
                r[1] = r[1].replace(new RegExp(zeroWidthSpace, 'g'), '');
                r = r.join(' ');
            }
            if (orphanControl === 3) {
                //replace spaces by non breaking spaces
                r = r.replace(/[ ]+/g, String.fromCharCode(160));
            }
            return r;
        },

        /**
         * @method Hyphenator~hyphenateElement
         * @desc
         * Takes the content of the given element and - if there's text - replaces the words
         * by hyphenated words. If there's another element, the function is called recursively.
         * When all words are hyphenated, the visibility of the element is set to 'visible'.
         * @param {string} lang - The language-code of the element
         * @param {Element} elo - The element to hyphenate {@link Hyphenator~elements~ElementCollection~Element}
         * @access private
         */
        hyphenateElement = function (lang, elo) {
            var el = elo.element,
                hyphenate,
                n,
                i,
                lo;
            if (Hyphenator.languages.hasOwnProperty(lang) && Hyphenator.doHyphenation) {
                lo = Hyphenator.languages[lang];
                hyphenate = function (match, word, url, mail) {
                    var r;
                    if (!!url || !!mail) {
                        r = hyphenateURL(match);
                    } else {
                        r = hyphenateWord(lo, lang, word);
                    }
                    return r;
                };
                if (safeCopy && (el.tagName.toLowerCase() !== 'body')) {
                    copy.registerOnCopy(el);
                }
                i = 0;
                n = el.childNodes[i];
                while (!!n) {
                    if (n.nodeType === 3 //type 3 = #text
                            && /\S/.test(n.data) //not just white space
                            && n.data.length >= min) { //longer then min
                        n.data = n.data.replace(lo.genRegExp, hyphenate);
                        if (orphanControl !== 1) {
                            n.data = n.data.replace(/[\S]+ [\S]+[\s]*$/, controlOrphans);
                        }
                    }
                    i += 1;
                    n = el.childNodes[i];
                }
            }
            if (intermediateState === 'hidden' && unhide === 'wait') {
                el.className = el.className.replace(hideClassRegExp, '');
                if (el.className === '') {
                    el.removeAttribute('class');
                }
            }
            if (intermediateState === 'hidden' && unhide === 'progressive') {
                el.className = el.className.replace(hideClassRegExp, ' ' + unhideClass);
            }
            elo.hyphenated = true;
            elements.hyCount += 1;
            if (elements.count <= elements.hyCount) {
                checkIfAllDone();
            }
        },

        /**
         * @method Hyphenator~hyphenateLanguageElements
         * @desc
         * Calls hyphenateElement() for all elements of the specified language.
         * If the language is '*' then all elements are hyphenated.
         * This is done with a setTimout
         * to prevent a "long running Script"-alert when hyphenating large pages.
         * Therefore a tricky bind()-function was necessary.
         * @param {string} lang The language of the elements to hyphenate
         * @access private
         */

        hyphenateLanguageElements = function (lang) {
            /*function bind(fun, arg1, arg2) {
                return function () {
                    return fun(arg1, arg2);
                };
            }*/
            var i, l;
            if (lang === '*') {
                elements.each(function (lang, ellist) {
                    var j, le = ellist.length;
                    for (j = 0; j < le; j += 1) {
                        //zeroTimeOut(bind(hyphenateElement, lang, ellist[j]));
                        hyphenateElement(lang, ellist[j]);
                    }
                });
            } else {
                if (elements.list.hasOwnProperty(lang)) {
                    l = elements.list[lang].length;
                    for (i = 0; i < l; i += 1) {
                        //zeroTimeOut(bind(hyphenateElement, lang, elements.list[lang][i]));
                        hyphenateElement(lang, elements.list[lang][i]);
                    }
                }
            }
        },

        /**
         * @method Hyphenator~removeHyphenationFromDocument
         * @desc
         * Does what it says and unregisters the onCopyEvent from the elements
         * @access private
         */
        removeHyphenationFromDocument = function () {
            elements.each(function (ellist) {
                var i, l = ellist.length;
                for (i = 0; i < l; i += 1) {
                    removeHyphenationFromElement(ellist[i].element);
                    if (safeCopy) {
                        copy.removeOnCopy(ellist[i].element);
                    }
                    ellist[i].hyphenated = false;
                }
            });
        },

        /**
         * @method Hyphenator~createStorage
         * @desc
         * inits the private var {@link Hyphenator~storage) depending of the setting in {@link Hyphenator~storageType}
         * and the supported features of the system.
         * @access private
         */
        createStorage = function () {
            var s;
            try {
                if (storageType !== 'none' &&
                        window.JSON !== undefined &&
                        window.localStorage !== undefined &&
                        window.sessionStorage !== undefined &&
                        window.JSON.stringify !== undefined &&
                        window.JSON.parse !== undefined) {
                    switch (storageType) {
                    case 'session':
                        s = window.sessionStorage;
                        break;
                    case 'local':
                        s = window.localStorage;
                        break;
                    default:
                        s = undefined;
                        break;
                    }
                    //check for private mode
                    s.setItem('storageTest', '1');
                    s.removeItem('storageTest');
                }
            } catch (e) {
                //FF throws an error if DOM.storage.enabled is set to false
                s = undefined;
            }
            if (s) {
                storage = {
                    prefix: 'Hyphenator_' + Hyphenator.version + '_',
                    store: s,
                    deferred: [],
                    test: function (name) {
                        var val = this.store.getItem(this.prefix + name);
                        return (!!val) ? true : false;
                    },
                    getItem: function (name) {
                        return this.store.getItem(this.prefix + name);
                    },
                    setItem: function (name, value) {
                        try {
                            this.store.setItem(this.prefix + name, value);
                        } catch (e) {
                            onError(e);
                        }
                    }
                };
            } else {
                storage = undefined;
            }
        },

        /**
         * @method Hyphenator~storeConfiguration
         * @desc
         * Stores the current config-options in DOM-Storage
         * @access private
         */
        storeConfiguration = function () {
            if (!storage) {
                return;
            }
            var settings = {
                'STORED': true,
                'classname': hyphenateClass,
                'urlclassname': urlHyphenateClass,
                'donthyphenateclassname': dontHyphenateClass,
                'minwordlength': min,
                'hyphenchar': hyphen,
                'urlhyphenchar': urlhyphen,
                'togglebox': toggleBox,
                'displaytogglebox': displayToggleBox,
                'remoteloading': enableRemoteLoading,
                'enablecache': enableCache,
                'enablereducedpatternset': enableReducedPatternSet,
                'onhyphenationdonecallback': onHyphenationDone,
                'onerrorhandler': onError,
                'onwarninghandler': onWarning,
                'intermediatestate': intermediateState,
                'selectorfunction': selectorFunction || mySelectorFunction,
                'safecopy': safeCopy,
                'doframes': doFrames,
                'storagetype': storageType,
                'orphancontrol': orphanControl,
                'dohyphenation': Hyphenator.doHyphenation,
                'persistentconfig': persistentConfig,
                'defaultlanguage': defaultLanguage,
                'useCSS3hyphenation': css3,
                'unhide': unhide,
                'onbeforewordhyphenation': onBeforeWordHyphenation,
                'onafterwordhyphenation': onAfterWordHyphenation
            };
            storage.setItem('config', window.JSON.stringify(settings));
        },

        /**
         * @method Hyphenator~restoreConfiguration
         * @desc
         * Retrieves config-options from DOM-Storage and does configuration accordingly
         * @access private
         */
        restoreConfiguration = function () {
            var settings;
            if (storage.test('config')) {
                settings = window.JSON.parse(storage.getItem('config'));
                Hyphenator.config(settings);
            }
        };

    return {

        /**
         * @member {string} Hyphenator.version
         * @desc
         * String containing the actual version of Hyphenator.js
         * [major release].[minor releas].[bugfix release]
         * major release: new API, new Features, big changes
         * minor release: new languages, improvements
         * @access public
         */
        version: '5.2.0(devel)',

        /**
         * @member {boolean} Hyphenator.doHyphenation
         * @desc
         * If doHyphenation is set to false, hyphenateDocument() isn't called.
         * All other actions are performed.
         * @default true
         */
        doHyphenation: true,

        /**
         * @typedef {Object} Hyphenator.languages.language
         * @property {Number} leftmin - The minimum of chars to remain on the old line
         * @property {Number} rightmin - The minimum of chars to go on the new line
         * @property {string} specialChars - Non-ASCII chars in the alphabet.
         * @property {Object.<number, string>} patterns - the patterns in a compressed format. The key is the length of the patterns in the value string.
         * @property {Object.<string, string>} charSubstitution - optional: a hash table with chars that are replaced during hyphenation
         * @property {string | Object.<string, string>} exceptions - optional: a csv string containing exceptions
         */

        /**
         * @member {Object.<string, Hyphenator.languages.language>} Hyphenator.languages
         * @desc
         * Objects that holds key-value pairs, where key is the language and the value is the
         * language-object loaded from (and set by) the pattern file.
         * @namespace Hyphenator.languages
         * @access public
         */
        languages: {},


        /**
         * @method Hyphenator.config
         * @desc
         * The Hyphenator.config() function that takes an object as an argument. The object contains key-value-pairs
         * containig Hyphenator-settings.
         * @param {Hyphenator.config} obj
         * @access public
         * @example
         * &lt;script src = "Hyphenator.js" type = "text/javascript"&gt;&lt;/script&gt;
         * &lt;script type = "text/javascript"&gt;
         *     Hyphenator.config({'minwordlength':4,'hyphenchar':'|'});
         *     Hyphenator.run();
         * &lt;/script&gt;
         */
        config: function (obj) {
            var assert = function (name, type) {
                    var r, t;
                    t = typeof obj[name];
                    if (t === type) {
                        r = true;
                    } else {
                        onError(new Error('Config onError: ' + name + ' must be of type ' + type));
                        r = false;
                    }
                    return r;
                },
                key;

            if (obj.hasOwnProperty('storagetype')) {
                if (assert('storagetype', 'string')) {
                    storageType = obj.storagetype;
                }
                if (!storage) {
                    createStorage();
                }
            }
            if (!obj.hasOwnProperty('STORED') && storage && obj.hasOwnProperty('persistentconfig') && obj.persistentconfig === true) {
                restoreConfiguration();
            }

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    switch (key) {
                    case 'STORED':
                        break;
                    case 'classname':
                        if (assert('classname', 'string')) {
                            hyphenateClass = obj[key];
                        }
                        break;
                    case 'urlclassname':
                        if (assert('urlclassname', 'string')) {
                            urlHyphenateClass = obj[key];
                        }
                        break;
                    case 'donthyphenateclassname':
                        if (assert('donthyphenateclassname', 'string')) {
                            dontHyphenateClass = obj[key];
                        }
                        break;
                    case 'minwordlength':
                        if (assert('minwordlength', 'number')) {
                            min = obj[key];
                        }
                        break;
                    case 'hyphenchar':
                        if (assert('hyphenchar', 'string')) {
                            if (obj.hyphenchar === '&shy;') {
                                obj.hyphenchar = String.fromCharCode(173);
                            }
                            hyphen = obj[key];
                        }
                        break;
                    case 'urlhyphenchar':
                        if (obj.hasOwnProperty('urlhyphenchar')) {
                            if (assert('urlhyphenchar', 'string')) {
                                urlhyphen = obj[key];
                            }
                        }
                        break;
                    case 'togglebox':
                        if (assert('togglebox', 'function')) {
                            toggleBox = obj[key];
                        }
                        break;
                    case 'displaytogglebox':
                        if (assert('displaytogglebox', 'boolean')) {
                            displayToggleBox = obj[key];
                        }
                        break;
                    case 'remoteloading':
                        if (assert('remoteloading', 'boolean')) {
                            enableRemoteLoading = obj[key];
                        }
                        break;
                    case 'enablecache':
                        if (assert('enablecache', 'boolean')) {
                            enableCache = obj[key];
                        }
                        break;
                    case 'enablereducedpatternset':
                        if (assert('enablereducedpatternset', 'boolean')) {
                            enableReducedPatternSet = obj[key];
                        }
                        break;
                    case 'onhyphenationdonecallback':
                        if (assert('onhyphenationdonecallback', 'function')) {
                            onHyphenationDone = obj[key];
                        }
                        break;
                    case 'onerrorhandler':
                        if (assert('onerrorhandler', 'function')) {
                            onError = obj[key];
                        }
                        break;
                    case 'onwarninghandler':
                        if (assert('onwarninghandler', 'function')) {
                            onWarning = obj[key];
                        }
                        break;
                    case 'intermediatestate':
                        if (assert('intermediatestate', 'string')) {
                            intermediateState = obj[key];
                        }
                        break;
                    case 'selectorfunction':
                        if (assert('selectorfunction', 'function')) {
                            selectorFunction = obj[key];
                        }
                        break;
                    case 'safecopy':
                        if (assert('safecopy', 'boolean')) {
                            safeCopy = obj[key];
                        }
                        break;
                    case 'doframes':
                        if (assert('doframes', 'boolean')) {
                            doFrames = obj[key];
                        }
                        break;
                    case 'storagetype':
                        if (assert('storagetype', 'string')) {
                            storageType = obj[key];
                        }
                        break;
                    case 'orphancontrol':
                        if (assert('orphancontrol', 'number')) {
                            orphanControl = obj[key];
                        }
                        break;
                    case 'dohyphenation':
                        if (assert('dohyphenation', 'boolean')) {
                            Hyphenator.doHyphenation = obj[key];
                        }
                        break;
                    case 'persistentconfig':
                        if (assert('persistentconfig', 'boolean')) {
                            persistentConfig = obj[key];
                        }
                        break;
                    case 'defaultlanguage':
                        if (assert('defaultlanguage', 'string')) {
                            defaultLanguage = obj[key];
                        }
                        break;
                    case 'useCSS3hyphenation':
                        if (assert('useCSS3hyphenation', 'boolean')) {
                            css3 = obj[key];
                        }
                        break;
                    case 'unhide':
                        if (assert('unhide', 'string')) {
                            unhide = obj[key];
                        }
                        break;
                    case 'onbeforewordhyphenation':
                        if (assert('onbeforewordhyphenation', 'function')) {
                            onBeforeWordHyphenation = obj[key];
                        }
                        break;
                    case 'onafterwordhyphenation':
                        if (assert('onafterwordhyphenation', 'function')) {
                            onAfterWordHyphenation = obj[key];
                        }
                        break;
                    default:
                        onError(new Error('Hyphenator.config: property ' + key + ' not known.'));
                    }
                }
            }
            if (storage && persistentConfig) {
                storeConfiguration();
            }
        },

        /**
         * @method Hyphenator.run
         * @desc
         * Bootstrap function that starts all hyphenation processes when called:
         * Tries to create storage if required and calls {@link Hyphenator~runWhenLoaded} on 'window' handing over the callback 'process'
         * @access public
         * @example
         * &lt;script src = "Hyphenator.js" type = "text/javascript"&gt;&lt;/script&gt;
         * &lt;script type = "text/javascript"&gt;
         *   Hyphenator.run();
         * &lt;/script&gt;
         */
        run: function () {
                /**
                 *@callback Hyphenator.run~process process - The function is called when the DOM has loaded (or called for each frame)
                 */
            var process = function () {
                try {
                    if (contextWindow.document.getElementsByTagName('frameset').length > 0) {
                        return; //we are in a frameset
                    }
                    autoSetMainLanguage(undefined);
                    gatherDocumentInfos();
                    if (displayToggleBox) {
                        toggleBox();
                    }
                    prepare(hyphenateLanguageElements);
                } catch (e) {
                    onError(e);
                }
            };

            if (!storage) {
                createStorage();
            }
            runWhenLoaded(window, process);
        },

        /**
         * @method Hyphenator.addExceptions
             * @desc
         * Adds the exceptions from the string to the appropriate language in the 
         * {@link Hyphenator~languages}-object
         * @param {string} lang The language
         * @param {string} words A comma separated string of hyphenated words WITH spaces.
         * @access public
         * @example &lt;script src = "Hyphenator.js" type = "text/javascript"&gt;&lt;/script&gt;
         * &lt;script type = "text/javascript"&gt;
         *   Hyphenator.addExceptions('de','ziem-lich, Wach-stube');
         *   Hyphenator.run();
         * &lt;/script&gt;
         */
        addExceptions: function (lang, words) {
            if (lang === '') {
                lang = 'global';
            }
            if (exceptions.hasOwnProperty(lang)) {
                exceptions[lang] += ", " + words;
            } else {
                exceptions[lang] = words;
            }
        },

        /**
         * @method Hyphenator.hyphenate
         * @access public
         * @desc
         * Hyphenates the target. The language patterns must be loaded.
         * If the target is a string, the hyphenated string is returned,
         * if it's an object, the values are hyphenated directly and undefined (aka nothing) is returned
         * @param {string|Object} target the target to be hyphenated
         * @param {string} lang the language of the target
         * @returns {string|undefined}
         * @example &lt;script src = "Hyphenator.js" type = "text/javascript"&gt;&lt;/script&gt;
         * &lt;script src = "patterns/en.js" type = "text/javascript"&gt;&lt;/script&gt;
         * &lt;script type = "text/javascript"&gt;
         * var t = Hyphenator.hyphenate('Hyphenation', 'en'); //Hy|phen|ation
         * &lt;/script&gt;
         */
        hyphenate: function (target, lang) {
            var hyphenate, n, i, lo;
            lo = Hyphenator.languages[lang];
            if (Hyphenator.languages.hasOwnProperty(lang)) {
                if (!lo.prepared) {
                    prepareLanguagesObj(lang);
                }
                hyphenate = function (match, word, url, mail) {
                    var r;
                    if (!!url || !!mail) {
                        r = hyphenateURL(match);
                    } else {
                        r = hyphenateWord(lo, lang, word);
                    }
                    return r;
                };
                if (typeof target === 'object' && !(typeof target === 'string' || target.constructor === String)) {
                    i = 0;
                    n = target.childNodes[i];
                    while (!!n) {
                        if (n.nodeType === 3 //type 3 = #text
                                && /\S/.test(n.data) //not just white space
                                && n.data.length >= min) { //longer then min
                            n.data = n.data.replace(lo.genRegExp, hyphenate);
                        } else if (n.nodeType === 1) {
                            if (n.lang !== '') {
                                Hyphenator.hyphenate(n, n.lang);
                            } else {
                                Hyphenator.hyphenate(n, lang);
                            }
                        }
                        i += 1;
                        n = target.childNodes[i];
                    }
                } else if (typeof target === 'string' || target.constructor === String) {
                    return target.replace(lo.genRegExp, hyphenate);
                }
            } else {
                onError(new Error('Language "' + lang + '" is not loaded.'));
            }
        },

        /**
         * @method Hyphenator.getRedPatternSet
         * @desc
         * Returns the reduced pattern set: an object looking like: {'patk': pat}
         * @param {string} lang the language patterns are stored for
         * @returns {Object.<string, string>}
         * @access public
         */
        getRedPatternSet: function (lang) {
            return Hyphenator.languages[lang].redPatSet;
        },

        /**
         * @method Hyphenator.isBookmarklet
         * @desc
         * Returns {@link Hyphenator~isBookmarklet}.
         * @returns {boolean}
         * @access public
         */
        isBookmarklet: function () {
            return isBookmarklet;
        },

        /**
         * @method Hyphenator.getConfigFromURI
         * @desc
         * reads and sets configurations from GET parameters in the URI
         * @access public
         */
        getConfigFromURI: function () {
            /*jslint evil: true*/
            var loc = null, re = {}, jsArray = contextWindow.document.getElementsByTagName('script'), i, j, l, s, gp, option;
            for (i = 0, l = jsArray.length; i < l; i += 1) {
                if (!!jsArray[i].getAttribute('src')) {
                    loc = jsArray[i].getAttribute('src');
                }
                if (loc && (loc.indexOf('Hyphenator.js?') !== -1)) {
                    s = loc.indexOf('Hyphenator.js?');
                    gp = loc.substring(s + 14).split('&');
                    for (j = 0; j < gp.length; j += 1) {
                        option = gp[j].split('=');
                        if (option[0] !== 'bm') {
                            if (option[1] === 'true') {
                                option[1] = true;
                            } else if (option[1] === 'false') {
                                option[1] = false;
                            } else if (isFinite(option[1])) {
                                option[1] = parseInt(option[1], 10);
                            }
                            if (option[0] === 'togglebox' ||
                                    option[0] === 'onhyphenationdonecallback' ||
                                    option[0] === 'onerrorhandler' ||
                                    option[0] === 'selectorfunction' ||
                                    option[0] === 'onbeforewordhyphenation' ||
                                    option[0] === 'onafterwordhyphenation') {
                                option[1] = new Function('', option[1]);
                            }
                            re[option[0]] = option[1];
                        }
                    }
                    break;
                }
            }
            return re;
        },

        /**
         * @method Hyphenator.toggleHyphenation
         * @desc
         * Checks the current state of the ToggleBox and removes or does hyphenation.
         * @access public
         */
        toggleHyphenation: function () {
            if (Hyphenator.doHyphenation) {
                if (!!css3hyphenateClassHandle) {
                    css3hyphenateClassHandle.setRule('.' + css3hyphenateClass, css3_h9n.property + ': none;');
                }
                removeHyphenationFromDocument();
                Hyphenator.doHyphenation = false;
                storeConfiguration();
                toggleBox();
            } else {
                if (!!css3hyphenateClassHandle) {
                    css3hyphenateClassHandle.setRule('.' + css3hyphenateClass, css3_h9n.property + ': auto;');
                }
                Hyphenator.doHyphenation = true;
                hyphenateLanguageElements('*');
                storeConfiguration();
                toggleBox();
            }
        }
    };
}(window));

//Export properties/methods (for google closure compiler)
/**** to be moved to external file
Hyphenator['languages'] = Hyphenator.languages;
Hyphenator['config'] = Hyphenator.config;
Hyphenator['run'] = Hyphenator.run;
Hyphenator['addExceptions'] = Hyphenator.addExceptions;
Hyphenator['hyphenate'] = Hyphenator.hyphenate;
Hyphenator['getRedPatternSet'] = Hyphenator.getRedPatternSet;
Hyphenator['isBookmarklet'] = Hyphenator.isBookmarklet;
Hyphenator['getConfigFromURI'] = Hyphenator.getConfigFromURI;
Hyphenator['toggleHyphenation'] = Hyphenator.toggleHyphenation;
window['Hyphenator'] = Hyphenator;
*/

/*
 * call Hyphenator if it is a Bookmarklet
 */
if (Hyphenator.isBookmarklet()) {
    Hyphenator.config({displaytogglebox: true, intermediatestate: 'visible', storagetype: 'local', doframes: true, useCSS3hyphenation: true});
    Hyphenator.config(Hyphenator.getConfigFromURI());
    Hyphenator.run();
}

// Latin hyphenation patterns converted by
// Pablo Rodríguez (hyphenator at pragmata dot tk)
// based on LaTeX Latin hyphenation patterns by Claudio Beccari
// (http://tug.ctan.org/tex-archive/language/hyphenation/lahyph.tex)
/*global Hyphenator*/
Hyphenator.languages['la'] = {
    leftmin: 2,
    rightmin: 2,
    specialChars: "æœ",
    patterns: {
        2: "æ1œ11b1c1d1f1g1h1j1k1l1m1n1p1r1t1v1x1z",
        3: "2bb2bdb2l2bm2bnb2r2bt2bs2b_2ccc2l2cm2cn2cqc2r2cs2ct2cz2c_2dd2dg2dmd2r2ds2dv2d_2fff2l2fnf2r2ft2f_2gg2gd2gfg2l2gmg2ng2r2gs2gv2g_2hp2ht2h_2kk2lb2lc2ld2lf2lg2lk2ll2lm2ln2lp2lq2lr2ls2lt2lv2l_2mm2mb2mp2ml2mn2mq2mr2mv2m_2nb2nc2nd2nf2ng2nl2nm2nn2np2nq2nr2ns2nt2nv2nx2n_p2hp2l2pn2ppp2r2ps2pt2pz2p_2rb2rc2rd2rf2rgr2h2rl2rm2rn2rp2rq2rr2rs2rt2rv2rz2r_1s22s_2tb2tc2td2tf2tgt2ht2lt2r2tm2tn2tp2tq2tt2tv2t_v2lv2r2vv2xt2xx2x_2z_",
        4: "a1iaa1iea1ioa1iuae1aae1oae1ue1iuio1io1iao1ieo1ioo1iuuo3uc2h2k2h22php2pht1qu22s3s2stb2stc2std2stf2stg2stm2stn2stp2stq2sts2stt2stv2st_a1uaa1uea1uia1uoa1uue1uae1uee1uie1uoe1uui1uai1uei1uii1uoi1uuo1uao1ueo1uio1uoo1uuu1uau1ueu1uiu1uou1uu",
        5: "_e2x1_o2b3l3f2tn2s3mn2s3f2s3ph2st3l",
        6: "_a2b3l_anti13p2sic3p2neua2l1uaa2l1uea2l1uia2l1uoa2l1uue2l1uae2l1uee2l1uie2l1uoe2l1uui2l1uai2l1uei2l1uii2l1uoi2l1uuo2l1uao2l1ueo2l1uio2l1uoo2l1uuu2l1uau2l1ueu2l1uiu2l1uou2l1uua2m1uaa2m1uea2m1uia2m1uoa2m1uue2m1uae2m1uee2m1uie2m1uoe2m1uui2m1uai2m1uei2m1uii2m1uoi2m1uuo2m1uao2m1ueo2m1uio2m1uoo2m1uuu2m1uau2m1ueu2m1uiu2m1uou2m1uua2n1uaa2n1uea2n1uia2n1uoa2n1uue2n1uae2n1uee2n1uie2n1uoe2n1uui2n1uai2n1uei2n1uii2n1uoi2n1uuo2n1uao2n1ueo2n1uio2n1uoo2n1uuu2n1uau2n1ueu2n1uiu2n1uou2n1uua2r1uaa2r1uea2r1uia2r1uoa2r1uue2r1uae2r1uee2r1uie2r1uoe2r1uui2r1uai2r1uei2r1uii2r1uoi2r1uuo2r1uao2r1ueo2r1uio2r1uoo2r1uuu2r1uau2r1ueu2r1uiu2r1uou2r1uu",
        7: "_para1i_para1u_su2b3r2s3que_2s3dem_",
        8: "_su2b3lu",
        9: "_anti3m2n_circu2m1_co2n1iun",
        10: "_di2s3cine"
    },
    patternChars: "_abcdefghijklmnopqrstuvxzæœ",
    patternArrayLength: 3273,
    valueStoreLength: 1010
};


/*global Hyphenator*/
Hyphenator.languages['pl'] = {
    leftmin: 2,
    rightmin: 2,
    specialChars: unescape("ąćęłńóśźżਂ%u200D"),
    patterns: {
        2: "a1ą1e1ę1i1o1ó1u1y1",
        3: "_a1_b8_c8_ć8_d8_e1_f8_g8_h8_i1_j8_k8_l8_ł8_m8_n8_ń8_o1_p8_r8_s8_ś8_t8_u1_v8_w8_x8_z8_ź8_ż8ś1cc4hc4zd4zd4źd4żr4zs4z8b_8c_8ć_8d_8f_8g_8h_8j_8k_8l_8ł_8m_8n_8ń_8p_8r_8s_8ś_8t_8v_8w_8x_8z_8ź_8ż_ae2ai2ao2be1bi1bo1bu1ca1cu1de1du1ea2ei2eo2fi1fo1ga1go1hi1hu1ja1ka1ki1ko1le1lu1ly1ma1mi1mo1mu1na1oa2oe2oi2ou2pa1po1ro1se1so1sy1to1tu1ty1ua2ue2ui2uo2vo1we1ya2ye2yi2yo2yu2ze1",
        4: "_ae2_be1_bh8_bj8_bl8_bł8_br8_bv8_bw8_bx8_ca1_ci1_cj8_cł8_cr8_cv8_cw8_cx8_ćh8_ćj8_ćl8_ćł8_ćr8_ćv8_ćw8_ćx8_da1_de1_dh8_dj8_dl8_dł8_do1_dr8_dv8_dw8_dx8_dy1_fb8_fć8_fd8_fg8_fh8_fj8_fl8_fł8_fń8_fp8_fr8_fs8_fś8_ft8_fv8_fw8_fx8_fz8_fź8_fż8_ge1_gh8_gj8_gl8_gł8_gn8_go1_gr8_gv8_gw8_gx8_hi1_hv8_hx8_ja1_jv8_jx8_kh8_ki1_kj8_kl8_kł8_ko1_kr8_kv8_kw8_kx8_lu1_lv8_lx8_łv8_łx8_mi1_mo1_mv8_mx8_na1_ne1_ni1_nv8_nx8_ńv8_ńx8_ot2_oa2_oc2_oć2_of2_og2_oh2_ok2_om2_op2_os2_oś2_ow2_oz2_oź2_oż2_pe1_ph8_pi1_pj8_pl8_pł8_po1_pó1_pr8_pv8_pw8_px8_re1_ro1_rv8_rx8_sa1_sc8_sć8_sh8_si1_sj8_sk8_sl8_sł8_sm8_sn8_sń8_so1_sp8_sr8_sś8_st8_su1_sv8_sw8_sx8_ść8_śh8_śj8_śl8_śł8_śm8_śn8_śń8_śr8_śv8_św8_śx8_ta1_te1_th8_tj8_tl8_tł8_to1_tr8_tv8_tw8_tx8_ty1_uć2_uś2_vb8_vc8_vć8_vd8_vf8_vg8_vh8_vj8_vk8_vl8_vł8_vm8_vn8_vń8_vp8_vr8_vs8_vś8_vt8_vv8_vw8_vx8_vz8_vź8_vż8_we1_wh8_wi1_wo1_wv8_wx8_wy1_xb8_xc8_xć8_xd8_xf8_xg8_xh8_xj8_xk8_xl8_xł8_xm8_xn8_xń8_xp8_xr8_xs8_xś8_xt8_xv8_xw8_xx8_xz8_xź8_xż8_za1_zb8_ze1_zg8_zh8_zi1_zj8_zl8_zł8_zm8_zn8_zń8_zo1_zr8_zv8_zw8_zx8_zź8_zż8_źh8_źj8_źł8_źń8_źr8_źv8_źx8_żh8_żv8_żx82b1c2b1ć2b1d2b1f2b1g2b1k2b1m2b1n2b1ń2b1p2b1s2b1ś2b1t2b1z2b1ź2b1ż2c1b2c1ć2c1d2c1f2c1g2c1k2c1l2c1m2c1n2c1ń2c1p2c1s2c1ś2c1t2c1ź2c1ż2ć1b2ć1c2ć1d2ć1f2ć1g2ć1k2ć1m2ć1n2ć1ń2ć1p2ć1s2ć1ś2ć1t2ć1z2ć1ź2ć1ż2d1b2d1c2d1ć2d1f2d1g2d1k2d1m2d1n2d1ń2d1p2d1s2d1ś2d1t2f1c2f1k2f1m2f1n2g1b2g1c2g1ć2g1d2g1f2g1k2g1m2g1ń2g1p2g1s2g1ś2g1t2g1z2g1ź2g1ż2h1b2h1c2h1ć2h1d2h1f2h1g2h1j2h1k2h1l2h1ł2h1m2h1n2h1ń2h1p2h1r2h1s2h1ś2h1t2h1w2h1z2h1ź2h1ż2j1b2j1c2j1ć2j1d2j1f2j1g2j1h2j1k2j1l2j1ł2j1m2j1n2j1ń2j1p2j1r2j1s2j1ś2j1t2j1w2j1z2j1ź2j1ż2k1b2k1c2k1ć2k1d2k1f2k1g2k1m2k1n2k1ń2k1p2k1s2k1ś2k1t2k1z2k1ź2k1ż2l1b2l1c2l1ć2l1d2l1f2l1g2l1h2l1j2l1k2l1ł2l1m2l1n2l1ń2l1p2l1r2l1s2l1ś2l1t2l1w2l1z2l1ź2l1ż2ł1b2ł1c2ł1ć2ł1d2ł1f2ł1g2ł1h2ł1j2ł1k2ł1l2ł1m2ł1n2ł1ń2ł1p2ł1r2ł1s2ł1ś2ł1t2ł1w2ł1z2ł1ź2ł1ż2m1b2m1c2m1ć2m1d2m1f2m1g2m1h2m1j2m1k2m1l2m1ł2m1n2m1ń2m1p2m1r2m1s2m1ś2m1t2m1w2m1z2m1ź2m1ż2n1b2n1c2n1ć2n1d2n1f2n1g2n1h2n1j2n1k2n1l2n1ł2n1m2n1ń2n1p2n1r2n1s2n1ś2n1t2n1w2n1z2n1ź2n1ż2ń1b2ń1c2ń1ć2ń1d2ń1f2ń1g2ń1h2ń1j2ń1k2ń1l2ń1ł2ń1m2ń1n2ń1ń2ń1p2ń1r2ń1s2ń1ś2ń1t2ń1w2ń1z2ń1ź2ń1ż2p1b2p1c2p1ć2p1d2p1f2p1g2p1k2p1m2p1n2p1ń2p1s2p1ś2p1t2p1z2p1ź2p1ż2r1b2r1c2r1ć2r1d2r1f2r1g2r1h2r1j2r1k2r1l2r1ł2r1m2r1n2r1ń2r1p2r1s2r1ś2r1t2r1w2r1ź2r1ż2s1b2s1d2s1f2s1g2s1s2s1ź2s1ż2ś1b2ś1d2ś1f2ś1g2ś1k2ś1p2ś1s2ś1ś2ś1t2ś1z2ś1ź2ś1ż2t1b2t1c2t1ć2t1d2t1f2t1g2t1k2t1m2t1n2t1ń2t1p2t1s2t1ś2t1z2t1ź2t1żtr4z2w1b2w1c2w1ć2w1d2w1f2w1g2w1j2w1k2w1l2w1ł2w1m2w1n2w1ń2w1p2w1r2w1s2w1ś2w1t2w1z2w1ź2w1ż2z1c2z1ć2z1d2z1f2z1k2z1p2z1s2z1ś2z1t2ź1b2ź1c2ź1ć2ź1d2ź1f2ź1g2ź1k2ź1l2ź1m2ź1n2ź1p2ź1s2ź1ś2ź1t2ź1w2ź1z2ź1ż2ż1b2ż1c2ż1ć2ż1d2ż1f2ż1g2ż1j2ż1k2ż1l2ż1ł2ż1m2ż1n2ż1ń2ż1p2ż1r2ż1s2ż1ś2ż1t2ż1w2ż1z2ż1źdni1mne1pne1wc4zwła1wło14b3b4c3c4ć3ć4d3d4f3f4g3g4h3h4j3j4k3k4l3l4ł3ł4m3m4n3n4p3p4r3r4t3t4w3w4z3z4ź3ź4ż3żbr4zdr4zpr4zrs4zsc4ha2u1a2y1a1a2blo1bro1chu1dże1er4ze2u1e2y1e1e2gra1gro1i2a1i2ą1i2e1i2ę1i2i1i2o1i2ó1i2u1i2y1o2y1oc4ho1o2pre1roe2sko1sza1sze1szy1u2y1u1u2_by1",
        5: "_a2d3_a2u1_c4h8_c4z8_cza1_ćwi1_dłu1_dro1_dwó1_d4z8_dzi1_d4ź8_d4ż8_ego1_gru1_i2n3_izo1_kro1_kró1_na2j_o2b2_o2d2_ob3r_oa3z_obu1_oda1_odu1_ogó1_oka1_okr2_ole1_osi1_pła1_poe2_pra1_pre1_r4z8_ską1_skl8_skr8_spo1_spó1_ste1_s4z8_sze1_ś1c8_śró1_świ1_toa3_tra1_tró1_u3b2_u3c2_u3d2_u3f2_u3g2_u3h2_u3k2_u3l2_u3ł2_u3m2_u3n2_u3p2_u3r2_u3s2_u3t2_u3w2_u3z2_u3ź2_u3ż2_ube1_ubr2_ukr2_upo1_uro1_utr2_uze1_wni1_ws4z_wyo2_wye2_wyi2_zao2_zai2_zde1_zdy1_zło1_zma1_zni1_zro12cz1b2cz1g2cz1l2cz1m2cz1n2cz1ń2cz1ź2cz1żd2ł1s2dz1b2dz1g2dz1l2dz1m2dz1n2dz1ń2dz1ź2dz1ż2dź1ń2rz1b2rz1g2rz1h2rz1j2rz1l2rz1ł2rz1m2rz1n2rz1ń2rz1r2rz1w2rz1ź2rz1żs2t1s2sz1l2sz1m2sz1n2sz1wwcza18b8b_8b8c_8b8ć_8b8d_8b8f_8b8g_8b8h_8b8j_8b8k_8b8l_8b8ł_8b8m_8b8n_8b8ń_8b8p_8b8r_8b8s_8b8ś_8b8t_8b8v_8b8w_8b8x_8b8z_8b8ź_8b8ż_8c8b_8c8c_8c8ć_8c8d_8c8f_8c8g_8c8h_c2h2łc2h2rchr4zc2h2w8c8j_8c8k_8c8l_8c8ł_8c8m_8c8n_8c8ń_8c8p_8c8r_8c8s_8c8ś_8c8t_8c8v_8c8w_8c8x_8c8z_8c8ź_8c8ż_8ć8b_8ć8c_8ć8ć_8ć8d_8ć8f_8ć8g_8ć8h_8ć8j_8ć8k_8ć8l_8ć8ł_8ć8m_8ć8n_8ć8ń_8ć8p_8ć8r_8ć8s_8ć8ś_8ć8t_8ć8v_8ć8w_8ć8x_8ć8z_8ć8ź_8ć8ż_8d8b_8d8c_8d8ć_8d8d_8d8f_8d8g_8d8h_8d8j_8d8k_8d8l_8d8ł_8d8m_8d8n_8d8ń_8d8p_8d8r_8d8s_8d8ś_8d8t_8d8v_8d8w_8d8x_8d8z_8d8ź_8d8ż_8f8b_8f8c_8f8ć_8f8d_8f8f_8f8g_8f8h_8f8j_8f8k_8f8l_8f8ł_8f8m_8f8n_8f8ń_8f8p_8f8r_8f8s_8f8ś_8f8t_8f8v_8f8w_8f8x_8f8z_8f8ź_8f8ż_8g8b_8g8c_8g8ć_8g8d_8g8f_8g8g_8g8h_8g8j_8g8k_8g8l_8g8ł_8g8m_8g8n_8g8ń_8g8p_8g8r_8g8s_8g8ś_8g8t_8g8v_8g8w_8g8x_8g8z_8g8ź_8g8ż_8h8b_8h8c_8h8ć_8h8d_8h8f_8h8g_8h8h_8h8j_8h8k_8h8l_8h8ł_8h8m_8h8n_8h8ń_8h8p_8h8r_8h8s_8h8ś_8h8t_8h8v_8h8w_8h8x_8h8z_8h8ź_8h8ż_8j8b_8j8c_8j8ć_8j8d_8j8f_8j8g_8j8h_8j8j_8j8k_8j8l_8j8ł_8j8m_8j8n_8j8ń_8j8p_8j8r_8j8s_8j8ś_8j8t_8j8v_8j8w_8j8x_8j8z_8j8ź_8j8ż_8k8b_8k8c_8k8ć_8k8d_8k8f_8k8g_8k8h_8k8j_8k8k_8k8l_8k8ł_8k8m_8k8n_8k8ń_8k8p_8k8r_8k8s_8k8ś_8k8t_8k8v_8k8w_8k8x_8k8z_8k8ź_8k8ż_8l8b_8l8c_8l8ć_8l8d_8l8f_8l8g_8l8h_8l8j_8l8k_8l8l_8l8ł_8l8m_8l8n_8l8ń_8l8p_8l8r_8l8s_8l8ś_8l8t_8l8v_8l8w_8l8x_8l8z_8l8ź_8l8ż_8ł8b_8ł8c_8ł8ć_8ł8d_8ł8f_8ł8g_8ł8h_8ł8j_8ł8k_8ł8l_8ł8ł_8ł8m_8ł8n_8ł8ń_8ł8p_8ł8r_8ł8s_8ł8ś_8ł8t_8ł8v_8ł8w_8ł8x_8ł8z_8ł8ź_8ł8ż_8m8b_8m8c_8m8ć_8m8d_8m8f_8m8g_8m8h_8m8j_8m8k_8m8l_8m8ł_8m8m_8m8n_8m8ń_8m8p_8m8r_8m8s_8m8ś_8m8t_8m8v_8m8w_8m8x_8m8z_8m8ź_8m8ż_8n8b_8n8c_8n8ć_8n8d_8n8f_8n8g_8n8h_8n8j_8n8k_8n8l_8n8ł_8n8m_8n8n_8n8ń_8n8p_8n8r_8n8s_8n8ś_8n8t_8n8v_8n8w_8n8x_8n8z_8n8ź_8n8ż_8ń8b_8ń8c_8ń8ć_8ń8d_8ń8f_8ń8g_8ń8h_8ń8j_8ń8k_8ń8l_8ń8ł_8ń8m_8ń8n_8ń8ń_8ń8p_8ń8r_8ń8s_8ń8ś_8ń8t_8ń8v_8ń8w_8ń8x_8ń8z_8ń8ź_8ń8ż_8p8b_8p8c_8p8ć_8p8d_8p8f_8p8g_8p8h_8p8j_8p8k_8p8l_8p8ł_8p8m_8p8n_8p8ń_8p8p_8p8r_8p8s_8p8ś_8p8t_8p8v_8p8w_8p8x_8p8z_8p8ź_8p8ż_8r8b_8r8c_8r8ć_8r8d_8r8f_8r8g_8r8h_8r8j_8r8k_8r8l_8r8ł_8r8m_8r8n_8r8ń_8r8p_8r8r_8r8s_8r8ś_8r8t_8r8v_8r8w_8r8x_8r8z_8r8ź_8r8ż_8s8b_8s8c_8s8ć_8s8d_8s8f_8s8g_8s8h_8s8j_8s8k_skr4z8s8l_8s8ł_8s8m_8s8n_8s8ń_8s8p_8s8r_8s8s_8s8ś_8s8t_str4z8s8v_8s8w_8s8x_8s8z_szc4z8s8ź_8s8ż_8ś8b_8ś8c_8ś8ć_8ś8d_8ś8f_8ś8g_8ś8h_8ś8j_8ś8k_8ś8l_8ś8ł_8ś8m_8ś8n_8ś8ń_8ś8p_8ś8r_8ś8s_8ś8ś_8ś8t_8ś8v_8ś8w_8ś8x_8ś8z_8ś8ź_8ś8ż_8t8b_8t8c_8t8ć_8t8d_8t8f_8t8g_8t8h_8t8j_8t8k_8t8l_8t8ł_8t8m_8t8n_8t8ń_8t8p_8t8r_8t8s_8t8ś_8t8t_8t8v_8t8w_8t8x_8t8z_8t8ź_8t8ż_8v8b_8v8c_8v8ć_8v8d_8v8f_8v8g_8v8h_8v8j_8v8k_8v8l_8v8ł_8v8m_8v8n_8v8ń_8v8p_8v8r_8v8s_8v8ś_8v8t_8v8v_8v8w_8v8x_8v8z_8v8ź_8v8ż_8w8b_8w8c_8w8ć_8w8d_8w8f_8w8g_8w8h_8w8j_8w8k_8w8l_8w8ł_8w8m_8w8n_8w8ń_8w8p_8w8r_8w8s_8w8ś_8w8t_8w8v_8w8w_8w8x_8w8z_8w8ź_8w8ż_8x8b_8x8c_8x8ć_8x8d_8x8f_8x8g_8x8h_8x8j_8x8k_8x8l_8x8ł_8x8m_8x8n_8x8ń_8x8p_8x8r_8x8s_8x8ś_8x8t_8x8v_8x8w_8x8x_8x8z_8x8ź_8x8ż_8z8b_8z8c_8z8ć_8z8d_zdr4z8z8f_8z8g_8z8h_8z8j_8z8k_8z8l_8z8ł_8z8m_8z8n_8z8ń_8z8p_8z8r_8z8s_8z8ś_8z8t_8z8v_8z8w_8z8x_8z8z_8z8ź_8z8ż_8ź8b_8ź8c_8ź8ć_8ź8d_8ź8f_8ź8g_8ź8h_8ź8j_8ź8k_8ź8l_8ź8ł_8ź8m_8ź8n_8ź8ń_8ź8p_8ź8r_8ź8s_8ź8ś_8ź8t_8ź8v_8ź8w_8ź8x_8ź8z_8ź8ź_8ź8ż_8ż8b_8ż8c_8ż8ć_8ż8d_8ż8f_8ż8g_8ż8h_8ż8j_8ż8k_8ż8l_8ż8ł_8ż8m_8ż8n_8ż8ń_8ż8p_8ż8r_8ż8s_8ż8ś_8ż8t_8ż8v_8ż8w_8ż8x_8ż8z_8ż8ź_8ż8ż_be1e2bino1bis4zb2r2dbroa2bus4zbusi1c2h2jc2h2lcur4zde2u1dus4zd2ż2jd2ż2ld2ż2łd2ż2rd2ż2werza1fis4zfor4zgado1his4zhuc4zi4n3ni2n1sj2t1łj2t1rled1wly2o2mar4zmis4zmi2e1moza1mur4zo4f3fó2w1cpoli1połu1p2r1cprc4hs2m2rsowi1syno1szto1to2y1tygo1we1e2ź2d4ź_gd4z_ina1",
        6: "_a2b1s_ad4e1_ad4i1_ad4o1_ad4u1_ad4y1_ad5op_ad5or_a2n1t_anty1_a2r1c_arcy1_au3g2_au3k2_au3t2_auto1_4b3b8_2b1c8_2b1ć8_2b1d8_be2z3_beza1_bezi1_bezm2_bezo2_bezw2_2b1f8_2b1g8_2b1k8_2b1m8_2b1n8_2b1ń8_2b1p8_br4z8_2b1s8_2b1ś8_2b1t8_2b1z8_2b1ź8_2b1ż8_cało1_2c1b8_4c3c8_2c1ć8_2c1d8_2c1f8_2c1g8_c2h2r_ci2e1_2c1k8_2c1l8_2c1m8_2c1n8_2c1ń8_2c1p8_2c1s8_2c1ś8_2c1t8_czte1_czwó1_2c1ź8_2c1ż8_2ć1b8_2ć1c8_4ć3ć8_2ć1d8_2ć1f8_2ć1g8_2ć1k8_2ć1m8_2ć1n8_2ć1ń8_2ć1p8_2ć1s8_2ć1ś8_2ć1t8_2ć1z8_2ć1ź8_2ć1ż8_dale1_2d1b8_2d1c8_2d1ć8_4d3d8_de2z3_deza2_dezo2_2d1f8_2d1g8_2d1k8_2d1m8_2d1n8_2d1ń8_do3b2_do3c2_do3ć2_do3d2_do3f2_do3g2_do3h2_do3k2_do3l2_do3ł2_do3m2_do3p2_do3r2_do3s2_do3ś2_do3t2_do3w2_do3z2_do3ź2_do3ż2_dobr2_dosm2_dotr2_2d1p8_dr4z8_2d1s8_2d1ś8_2d1t8_dy2s3_dy2z3_dyzu2_e1me1_e1se1_e2s1t_egoa2_egoi2_egou2_e1le1_2f1c8_4f3f8_2f1k8_2f1m8_2f1n8_2g1b8_2g1c8_2g1ć8_2g1d8_ge2o3_2g1f8_4g3g8_2g1k8_2g1m8_2g1ń8_go2u3_2g1p8_gr4z8_2g1s8_2g1ś8_2g1t8_2g1z8_2g1ź8_2g1ż8_2h1b8_2h1c8_2h1ć8_2h1d8_2h1f8_2h1g8_4h3h8_hipe1_2h1j8_2h1k8_2h1l8_2h1ł8_2h1m8_2h1n8_2h1ń8_2h1p8_2h1r8_2h1s8_2h1ś8_2h1t8_2h1w8_2h1z8_2h1ź8_2h1ż8_i2s3l_i1ni1_i2n1f_izoa2_izoe2_izou2_2j1b8_2j1c8_2j1ć8_2j1d8_2j1f8_2j1g8_2j1h8_4j3j8_2j1k8_2j1l8_2j1ł8_2j1m8_2j1n8_2j1ń8_2j1p8_2j1r8_2j1s8_2j1ś8_2j1t8_2j1w8_2j1z8_2j1ź8_2j1ż8_2k1b8_2k1c8_2k1ć8_2k1d8_2k1f8_2k1g8_4k3k8_2k1m8_2k1n8_2k1ń8_2k1p8_kr4z8_2k1s8_2k1ś8_2k1t8_2k1z8_2k1ź8_2k1ż8_2l1b8_2l1c8_2l1ć8_2l1d8_2l1f8_2l1g8_2l1h8_2l1j8_2l1k8_4l3l8_2l1ł8_2l1m8_2l1n8_2l1ń8_2l1p8_2l1r8_2l1s8_2l1ś8_2l1t8_ludo1_2l1w8_2l1z8_2l1ź8_2l1ż8_2ł1b8_2ł1c8_2ł1ć8_2ł1d8_2ł1f8_2ł1g8_2ł1h8_2ł1j8_2ł1k8_2ł1l8_4ł3ł8_2ł1m8_2ł1n8_2ł1ń8_2ł1p8_2ł1r8_2ł1s8_2ł1ś8_2ł1t8_2ł1w8_2ł1z8_2ł1ź8_2ł1ż8_2m1b8_2m1c8_2m1ć8_2m1d8_2m1f8_2m1g8_2m1h8_2m1j8_2m1k8_2m1l8_2m1ł8_4m3m8_2m1n8_2m1ń8_2m1p8_2m1r8_2m1s8_2m1ś8_2m1t8_2m1w8_2m1z8_2m1ź8_2m1ż8_na2d2_na3b2_na3c2_na3ć2_na3f2_na3g2_na3h2_na3k2_na3l2_na3ł2_na3m2_na3p2_na3r2_na3s2_na3ś2_na3t2_na3u2_na3w2_na3z2_na3ź2_na3ż2_nakr2_napo1_naro1_nasm2_nazw2_2n1b8_2n1c8_2n1ć8_2n1d8_ne2o3_2n1f8_2n1g8_2n1h8_ni2e1_nieo2_2n1j8_2n1k8_2n1l8_2n1ł8_2n1m8_4n3n8_2n1ń8_2n1p8_2n1r8_2n1s8_2n1ś8_2n1t8_2n1w8_2n1z8_2n1ź8_2n1ż8_2ń1b8_2ń1c8_2ń1ć8_2ń1d8_2ń1f8_2ń1g8_2ń1h8_2ń1j8_2ń1k8_2ń1l8_2ń1ł8_2ń1m8_2ń1n8_2ń1ń8_2ń1p8_2ń1r8_2ń1s8_2ń1ś8_2ń1t8_2ń1w8_2ń1z8_2ń1ź8_2ń1ż8_o2t1c_otc4h_ob3l2_oblu1_ob3ł2_obra1_obry1_o3be1_o3bi1_od3i2_od3r2_odra1_odrę1_odru1_od5z2_odzi1_o3de1_o2l1ś_ob3h2_ob3j2_o1bo1_ob3w2_oc4h2_oc4z2_od3h2_od3j2_od3l2_o1do1_od3w2_od5ż2_odbe1_od4ź2_ogni1_o2p1c_o2r1t_or4z2_os4z2_ośmi1_2p1b8_2p1c8_pc4h8_2p1ć8_2p1d8_pe2r3_pe1e2_2p1f8_2p1g8_pi2e1_pi2ę1_pi2o1_2p1k8_2p1m8_2p1n8_2p1ń8_po2d2_po3b2_po3c2_po3ć2_podi1_po3f2_po3g2_po3h2_po3k2_po3l2_po3ł2_po3m2_po3p2_po3r2_po3s2_po3ś2_po3t2_po3w2_po3z2_po3ź2_po3ż2_podó1_pobr2_pokl2_pokr2_pona1_poni1_posm2_potr2_poza1_pozw2_pó2ł3_półe1_póło2_4p3p8_pr4z8_prze1_przy1_2p1s8_2p1ś8_2p1t8_2p1z8_2p1ź8_2p1ż8_2r1b8_2r1c8_2r1ć8_2r1d8_2r1f8_2r1g8_2r1h8_2r1j8_2r1k8_2r1l8_2r1ł8_2r1m8_2r1n8_2r1ń8_ro2z3_rozi2_rozm2_rozw2_2r1p8_4r3r8_2r1s8_2r1ś8_2r1t8_2r1w8_2r1ź8_2r1ż8_samo1_2s1b8_sc4h8_2s1d8_2s1f8_2s1g8_si2e1_2s1s8_su2b3_subi1_subo1_supe1_2s1ź8_2s1ż8_2ś1b8_2ś1d8_2ś1f8_2ś1g8_2ś1k8_2ś1p8_2ś1s8_2ś1ś8_2ś1t8_2ś1z8_2ś1ź8_2ś1ż8_ta2o3_tar4z_2t1b8_2t1c8_tc4h8_2t1ć8_2t1d8_te2o3_2t1f8_2t1g8_2t1k8_2t1m8_2t1n8_2t1ń8_2t1p8_tr4z8_trze1_2t1s8_2t1ś8_4t3t8_tysi1_2t1z8_2t1ź8_2t1ż8_u4d3k_u4f3n_ukle1_u4l3s_u4l3t_u2m1b_u4n3c_u4n3d_u4p3p_u4r3s_uc4h2_uc4z2_ud4z2_ud4ź2_ud4ż2_u2p1c_ur4z2_us4z2_2w1b8_2w1c8_2w1ć8_2w1d8_we3b2_we3c2_we3ć2_we3d2_we3f2_we3g2_we3h2_we3k2_we3l2_we3ł2_we3m2_we3n2_we3p2_we3r2_we3s2_we3ś2_we3t2_we3w2_we3z2_we3ż2_2w1f8_2w1g8_wi2e1_2w1j8_2w1k8_2w1l8_2w1ł8_2w1m8_2w1n8_2w1ń8_2w1p8_2w1r8_2w1s8_wspó1_wsze1_2w1ś8_2w1t8_4w3w8_wy3b2_wy3c2_wy3ć2_wy3d2_wy3f2_wy3g2_wy3h2_wy3k2_wy3l2_wy3ł2_wy3m2_wy3p2_wy3r2_wy3s2_wy3ś2_wy3t2_wy3w2_wy3z2_wy3ź2_wy3ż2_wybr2_wydr2_wykl2_wykr2_wysm2_wytr2_2w1z8_2w1ź8_2w1ż8_za3b2_za3c2_za3ć2_za3d2_za3f2_za3g2_za3h2_za3k2_za3l2_za3ł2_za3m2_za3p2_za3r2_za3s2_za3ś2_za3t2_za3u2_za3w2_za3z2_za3ź2_za3ż2_zabr2_zado1_zadr2_zady1_zakl2_zakr2_zani1_zasm2_zatr2_2z1c8_2z1ć8_2z1d8_ze3b2_ze3c2_ze3ć2_ze3d2_ze3f2_ze3g2_ze3h2_ze3k2_ze3l2_ze3ł2_ze3m2_ze3p2_ze3r2_ze3s2_ze3ś2_ze3t2_ze3w2_ze3z2_ze3ź2_ze3ż2_zekl2_zesm4_2z1f8_2z1k8_zo2o3_2z1p8_2z1s8_2z1ś8_2z1t8_4z3z8_2ź1b8_2ź1c8_2ź1ć8_2ź1d8_2ź1f8_2ź1g8_2ź1k8_2ź1l8_2ź1m8_2ź1n8_2ź1p8_2ź1s8_2ź1ś8_2ź1t8_2ź1w8_2ź1z8_4ź3ź8_2ź1ż8_2ż1b8_2ż1c8_2ż1ć8_2ż1d8_2ż1f8_2ż1g8_2ż1j8_2ż1k8_2ż1l8_2ż1ł8_2ż1m8_2ż1n8_2ż1ń8_2ż1p8_2ż1r8_2ż1s8_2ż1ś8_2ż1t8_2ż1w8_2ż1z8_2ż1ź8_4ż3ż81ś2ci12b2ł1k2b2r1n2c2h1b2c2h1c2c2h1ć2c2h1d2c2h1f2c2h1g2c2h1k2c2h1m2c2h1n2c2h1ń2c2h1p2c2h1s2c2h1ś2c2h1t2c2h1z2c2h1ź2c2h1ż2c2z1c2c2z1ć2c2z1d2c2z1f2c2z1k2c2z1p2c2z1s2c2z1ś2c2z1t2c4z3z2d2ł1b2dłs4z2d2r1n2d2z1c2d2z1ć2d2z1d2d2z1f2d2z1k2d2z1p2d2z1s2d2z1ś2d2z1t2d4z3z2d2ź1b2d2ź1c2d2ź1ć2d2ź1d2d2ź1f2d2ź1g2d2ź1k2d2ź1m2d2ź1n2d2ź1p2d2ź1s2d2ź1ś2d2ź1t2d2ź1z2d4ź3ź2d2ź1ż2d2ż1b2d2ż1c2d2ż1ć2d2ż1d2d2ż1f2d2ż1g2d2ż1k2d2ż1m2d2ż1n2d2ż1ń2d2ż1p2d2ż1s2d2ż1ś2d2ż1t2d2ż1z2d2ż1ź2d4ż3ż2g2ł1b2k1s4z2k2ł1b2n2t1n2p1s4z2p2l1n2r2z1c2r2z1ć2r2z1d2r2z1f2r2z1k2r2z1p2r2z1s2r2z1ś2r2z1t2s2ł1b2s2n1k2s2t1k2s2t1n2sts4z2s2z1c2s2z1ć2s2z1f2s2z1k2s2z1p2s2z1s2s2z1ś2s2z1t2s4z3z2ś2ć1c2ś2l1m2ś2l1n2t2l1n2t2r1k2z2d1k2z2d1ndni2o13m2k2n3w2ład3w2łosbe2ethbizne1bi2r1mbu2k1sca2l1dchus1tcurzo1d2rz2wfisha1fo2k1sforza1fo2l1kfo2s1ffosfa1ga2d1ggadge1go2l1fhuxle1in2n1sin2s1bja4z3zka2r1lki2r1ckirc4hko2n1glu2k1smier4zmo2n1tmozai2murza1na2ł1knałko1na4r3vochmi1offse1pa1na1po2d1npodni1po2m1npo2r1tpo2w1spows4zprcha1pres4zskor4zsyste1sze4śćto1yo2tu2r1bturbo1vo2l1kze4p3p_byna1_gdzi1_o2w1s_ows4z_póła1",
        7: "_a1d4a1_ae3ro1_aeroi2_aerou2_antye2_antyi2_antyo2_antyu2_arcye2_arcyi2_arcyo2_arcyu2_autoe2_autoi2_be1ze1_be2z1c_be4z3z_bezzw2_chr4z8_2c2z1t_ćwi2e1_de1ze1_długo1_do4k3t_do4l3n_do4ł3k_do4m3k_do4r3s_do4w3c_doc4h2_doc4z2_dod4z2_dod4ź2_dod4ż2_do2p1c_dor4z2_dos4z2_dwó2j3_dy3s4z_dzi2e1_e2k2s3_emes4z_e1goe2_ego1o2_eks4y1_grubo1_i3n4ic_i3n4o1_i3n4u1_infla1_ino3w2_i1zoi2_izo1o2_jadło1_ki2l1k_kilku1_ko1ło1_ko2n1t_kro2ć3_mi1li1_mo2ż1n_nad3i2_nad3ł2_nadłu1_nadmu1_nad3r2_nadre1_nadrę1_nadru1_nad3w2_nadwo1_na1da1_na3daj_na3dą1_na3de1_na3dę1_na3do1_na3dy1_nad4z2_na1ja1_na3ją1_na3je1_na3ję1_na4f3c_na4f3t_na4r3c_na4r3d_na4r3k_na4r3r_na4r3t_nac4h2_nac4z2_nad3h2_nad3j2_nad3l2_nad3u2_nad5ż2_nadtr2_naj3i2_naj3o2_najro1_naj3u2_najbe1_najdo1_najkr2_najsm2_najzw2_nar4z2_nas4z2_na2t1c_naz3m2_nie3b2_nie3c2_nie3ć2_nie3d2_nie3f2_nie3g2_nie3h2_nie3k2_nie3l2_nie3ł2_nie3m2_nie3p2_nie3r2_nie3s2_nie3ś2_nie3t2_nie3u2_nie3w2_nie3z2_nie3ź2_nie3ż2_niedo1_nieob2_nieoc2_nieoć2_nieod2_nieof2_nieog2_nieoh2_nieok2_nieol2_nieoł2_nieom2_nieop2_nieor2_nieos2_nieoś2_nieot2_nieow2_nieoz2_nieoź2_nieoż2_niepo1_niero1_niesu1_nietr2_nieuw2_niewy1_niezw2_o1bło1_o1bro1_o1dro1_od2r1w_odr4z2_odrze1_o3l2śn_obrze1_obrzę1_obrzu1_obrzy1_o2b3c2_o2b3ć2_o2b3d2_o2b3f2_o2b3g2_o2b3k2_o2b3m2_o2b3n2_o2b3p2_o2b3s2_o2b3ś2_o2b3t2_o2b3ź2_o2b3ż2_obc4h2_obc4z2_obd4z2_obd4ź2_obd4ż2_obe3b2_obe3c2_obe3ć2_obe3d2_obe3f2_obe3g2_obe3h2_obe3k2_obe3l2_obe3ł2_obe3m2_obe3p2_obe3r2_obe3s2_obe3ś2_obe3t2_obe3w2_obe3z2_obe3ź2_obe3ż2_obi3b2_obs4z2_oc2h2r_o2d3b2_o2d3c2_o2d3ć2_o4d3d2_o2d3f2_o2d3g2_o2d3k2_o2d3m2_o2d3n2_od3o2s_o2d3p2_o2d3s2_o2d3ś2_o2d3t2_odc4h2_odc4z2_odd4z2_odd4ź2_odd4ż2_ode3b2_ode3c2_ode3ć2_ode3d2_ode3f2_ode3g2_ode3h2_ode3k2_ode3l2_ode3ł2_ode3m2_ode3p2_ode3r2_ode3s2_ode3ś2_ode3t2_ode3w2_ode3z2_ode3ź2_ode3ż2_ods4z2_oka3m2_opc4h2_or2tę1_o2r2ż2_osi2e1_pe3c2k_pe2ł1n_pełno1_pe1pe1_pe1ze1_pię2ć3_pod3ł2_podmu1_podna1_pod3r2_podra1_podre1_podrę1_podró1_podru1_podry1_podr4z_pod3w2_podwa1_podwó1_po3da1_po3dą1_po3de1_po3dej_po3dę1_po3do1_po3du1_po3dy1_po3r1ż_poc4z2_podza1_podzi1_po4l3s_po4m3p_po4ń3c_po4r3c_po4r3f_po4r3n_po4r3t_poc4h2_pod3h2_pod3j2_pod3l2_pod5ż2_podsm2_po2p1c_po1po1_po1ro1_por4z2_pos4z2_poz4m2_półkr2_pó2ł1p_pra3s2_predy1_przyo2_retra1_ro1zo2_ro2z1p_roztr2_skąd4ż_so1bo1_spo2d2_spo3b2_spo3c2_spo3ć2_spo3f2_spo3g2_spo3h2_spo3k2_spo3l2_spo3ł2_spo3m2_spo3p2_spo3r2_spo3s2_spo3ś2_spo3t2_spo3w2_spo3z2_spo3ź2_spo3ż2_spó2ł3_sze2s3_sześ1c_śró2d5_śródr2_świ2a1_tró2j3_tróje1_u4m3br_ube2z3_ubezw2_u2m1k2_upc4h2_upo2d2_upo3b2_upo3c2_upo3ć2_upo3f2_upo3g2_upo3h2_upo3k2_upo3l2_upo3ł2_upo3m2_upo3p2_upo3r2_upo3s2_upo3ś2_upo3t2_upo3w2_upo3z2_upo3ź2_upo3ż2_uro2z3_u2r1ż2_usc4h2_u2t1k2_uze3w2_we4k3t_we4l3w_we4ł3n_we4n3d_we4n3t_we4r3b_we4r3d_we4r3n_we4r3s_we4r3t_wec4h2_wec4z2_wed4z2_wed4ź2_wed4ż2_we2p1c_wer4z2_wes4z2_we2w1n_wewną1_wielo1_wielu1_wi2l1c_wilc4z_wni2e1_wo1do1_wyc4z2_wy2ż1s_wyc4h2_wyd4z2_wyd4ź2_wyd4ż2_wy2p1c_wyr4z2_wys4z2_wy2t1c_za4k3t_za4l3g_za4l3k_za4l3t_za4m3k_za2r1c_zac4h2_zac4z2_zad4z2_zad4ź2_zad4ż2_zai2n3_zar4z2_zas4z2_zde2z3_zdeza1_ze4r3k_ze1te1_zetha1_zec4h2_zec4z2_zed4z2_zed4ź2_zed4ż2_ze2p1c_zer4z2_zes4z2_zi2m1n_zimno1_zło3w2_zni2e1_zro2z3_ź2d4ź82sz2l1n2t2rz1n3d2niow3m2nest3m2nezj3w2czas8b8r8z_8c8h8ł_8c8h8w_8c8z8t_8d8r8z_8k8s8t_8m8s8t_8p8r8z_8r8s8z_8r8z8ł_8s8c8h_8s8t8r_8s8t8w_sz2cz1b8s8z8k_8s8z8n_8s8z8t_8t8r8z_8z8d8r_be1khe1biszko1bi1rmi1blokha1bu2sz1mbusine1caldwe1deu2t1sduszpa1dże4z3bdże4z3me2r5zace3u2s4zgol2f3sgra2n1dgrandi1gro4t3rhu2cz1winn2s1binsbru1kar2l1skongre1luftwa1luk2s1fluksfe1mi2sz1mmiszma1montre1o2c2h1mó4w3c4zpaname1pa1sca1por2t1sportla1poli2e1poli2u1powsze1pr2chalroe2n1tro1kro1ro1sto1sowi3z2s4zas4zszezlo1szy2n1k_inac4z_ni2g1d_nigdy1_nigd4z_owsze1_skądi1_trója1",
        8: "_a2b2s3t_ad5i2u1_a1eroa2_ae1roe2_aero1o2_a1ntya2_arcy3b2_arcy3k2_arcy3ł2_arcy3m2_a1rcya2_a1utoa2_auto1o2_au1tou2_be3z4an_be3z4ec_be3z4ik_bezc4h2_cało3k2_cało3ś2_cie2n1k_cienko1_ciepło1_cza2r1n_czarno1_2c2z1k8_cztero1_czwó2r3_daleko1_dezabi1_de3z4el_de3z4er_de3z4y1_dobr4z2_dogr4z2_dopc4h2_dopr4z2_do2r1ż2_dosc4h2_do2t1k2_dro1go1_dy3s4e1_dy3s4o1_dy3s4y1_dy3z4e1_e2s1ha1_ele2k1t_hipe2r3_hipera2_i4n5o2k_koło3w2_kontru2_kró2t1k_krótko1_ludo3w2_mili2a1_mo1żno1_na3d4ir_na2d3m2_na3dzi1_na3d4ź2_nadoki1_nadrze1_nabr4z2_na2d3b2_na2d3c2_na2d3ć2_na4d3d2_nade3t2_na2d3f2_na2d3g2_na2d3k2_na2d3n2_na2d3p2_na2d3s2_na2d3ś2_na2d3t2_na2dz1m_nadzmy1_nad5zo1_nad5zó1_nadzwy1_nadc4h2_nadc4z2_nadd4ź2_nade3b2_nade3c2_nade3ć2_nade3d2_nade3f2_nade3g2_nade3h2_nade3k2_nade3l2_nade3ł2_nade3m2_nade3p2_nade3r2_nade3s2_nade3ś2_nade3w2_nade3z2_nade3ź2_nade3ż2_nads4z2_nadśro1_nagr4z2_na2j3b2_na2j3c2_na2j3ć2_na2j3d2_na2j3f2_na2j3g2_na2j3h2_na2j3k2_na2j3l2_na2j3ł2_na2j3m2_na2j3p2_na2j3r2_na2j3s2_na2j3ś2_na2j3t2_na2j3w2_na2j3z2_na2j3ź2_na2j3ż2_najc4h2_najc4z2_najd4z2_najd4ź2_najd4ż2_najr4z2_najs4z2_napo2d2_napo3b2_napo3c2_napo3ć2_napo3f2_napo3g2_napo3h2_napo3k2_napo3l2_napo3ł2_napo3m2_napo3p2_napo3r2_napo3s2_napo3ś2_napo3t2_napo3w2_napo3z2_napo3ź2_napo3ż2_napr4z2_naro2z3_na2r1ż2_natc4h2_na2t1k2_nie4c3c_nie4c3k_nie4m3c_nie4m3k_niec4h2_niec4z2_nied4z2_nied4ż2_nieodw2_niepr4z_nier4z2_nies4z2_o3b4łą1_o3b4łę1_o3b4łoc_o3b4rać_o3b4ron_o3b4roń_o3b4ryz_o3b4ryź_o3d4rap_o3d4ręt_odrobi1_o3d4rut_ob3u2m2_obe3r3t_obe4c3n_obe4z3w_obec4h2_obec4z2_obed4z2_obed4ź2_obed4ż2_obe2r3m_ober4z2_obes4z2_ochr4z2_od3a2u1_od3u2m2_odbe2z3_odec4h2_odec4z2_oded4z2_oded4ź2_oded4ż2_ode2p1c_oder4z2_odes4z2_ode2t1c_odkr4z2_ogó2l1n_o1le2o3_osie2m3_pe3r4e1_pe3r4i1_pe3r4o1_pe3r4u1_pe3r4y1_pepee2r_pepee2s_pie2r1w_pierwo1_pi1ęci1_pię2ć1s_pięćse1_pio1no1_płasko1_po2d3m2_po2d3n2_pod2r1w_po1dro1_po1dwo1_po3d4z2_po3d4ź2_pode3k2_podobi1_podobó1_podoc4h_podoki1_podopi1_podory1_podosi1_po4d3ów_podura1_podus4z_po2dz1b_po4st3h_po4st3l_pobr4z2_poc2h2r_po2d3b2_po2d3c2_po2d3ć2_po4d3d2_po2d3f2_po2d3g2_pod3i2n_po2d3k2_po2d3p2_po2d3s2_po2d3ś2_podśró1_po2d3t2_podc4h2_podc4z2_podd4ź2_podd4ż2_pode3b2_pode3c2_pode3ć2_pode3d2_pode3f2_pode3g2_pode3h2_pode3l2_pode3ł2_pode3m2_pode3p2_pode3r2_pode3s2_pode3ś2_pode3t2_pode3w2_pode3z2_pode3ź2_pode3ż2_pods4z2_pogr4z2_po2ł1k2_pom4p1k_po2m1k2_pona2d2_pona3b2_pona3c2_pona3ć2_pona3f2_pona3g2_pona3h2_pona3k2_pona3l2_pona3ł2_pona3m2_pona3p2_pona3r2_pona3s2_pona3ś2_pona3t2_pona3w2_pona3z2_pona3ź2_pona3ż2_ponasm2_ponazw2_poni2e1_popc4h2_popo3w2_popr4z2_por4t1w_por4t1f_por4t1m_poro2z3_posc4h2_po2t1k2_poza3u2_pó3ł4ą1_pó3ł4ę1_pó3ł4y1_pó2ł1k2_pó2ł1m2_półob3r_półpr4z_pra2w1n_pra3w2z_prze2d2_prze3b2_prze3c2_prze3ć2_prze1e2_prze3f2_prze3g2_prze3h2_prze3k2_prze3l2_prze3ł2_prze3m2_prze3n2_prze3p2_prze3r2_prze3s2_prze3ś2_prze3t2_prze3u2_prze3w2_prze3z2_prze3ź2_prze3ż2_przebr2_przeci1_przeda1_przekl2_przekr2_przesm2_przetr2_przy3b2_przy3c2_przy3ć2_przy3d2_przy3f2_przy3g2_przy3h2_przy3k2_przy3l2_przy3ł2_przy3m2_przy3p2_przy3r2_przy3s2_przy3ś2_przy3t2_przy3w2_przy3z2_przy3ź2_przy3ż2_przybr2_przyoz2_ro3z4a1_ro3z4e1_ro3z4ej_ro3z4u1_rozani1_ro2z1d2_ro1zpo1_ro2z1ś2_ro2z1t2_samo3k2_samo3p2_samo3w2_sie1de1_sie2d1m_sobo3w2_spo4r3n_spo4r3t_spoc4h2_spoc4z2_spo4d3d_spod4ź2_spod4ż2_spor4z2_spos4z2_ste1re1_supe2r3_supera1_superi1_super4z_supero1_ta1rza1_transi1_transo2_tysi2ą1_u4k3lej_u4p3p2s_u4s2t3n_u4s2t1c_u4s2t1k_u4z3be1_upo3da1_upoc4h2_upoc4z2_upo4d3d_upod4ź2_upod4ż2_upor4z2_upos4z2_wes2t1c_we4z3br_we4z3gł_we2m1k2_wepc4h2_we2t1k2_wilczo1_wniebo1_wodo3w2_wspó2ł3_współi2_współo1_współu2_wybr4z2_wygr4z2_wyi2zo1_wykr4z2_wy2m1k2_wypc4h2_wypr4z2_wy2r1ż2_wysc4h2_wytc4h2_wy2t1k2_za4uto1_zabr4z2_zagr4z2_zai2zo1_zai1ni1_zain4ic_zakr4z2_zani2e1_za2r1ż2_zasc4h2_za2t1k2_zde1ze1_zdysko1_ze3t1k2_zepc4h2_ze2r1ż2_zesc4h2_zma2r1t_znie3b2_znie3c2_znie3ć2_znie3d2_znie3f2_znie3g2_znie3h2_znie3k2_znie3l2_znie3ł2_znie3m2_znie3n2_znie3ń2_znie3p2_znie3r2_znie3s2_znie3ś2_znie3t2_znie3w2_znie3z2_znie3ź2_znie3ż23k2s2z2t3m2s2k2n3p2ne2u18ch8r8z_8sk8r8z_8sz8c8z_8sz8t8r_bi2s2z1kbi2z3nesbo2s3ma1bu2k1s4zbukszpa1cu2r7zondeutsc4hdu2s2z1pfi1szbi1fo2k2s3tfo2r5zacfo1lklo1ga3d2getgado2p1tgolfs4z2hi2s2z3pinnsbru1in4sbrucja4z4z3bja4z4z3mkarlsru1kirc4h3hkirchho1ma2r5z1lma2r5z1łma2r5z1nmontrea2moza2i3kmurzasi1of2f3setpa2s3calpa2s3c4hpodni2e1po3m2ną1po3m2nę1po3m2ni1poli3e2tpołu2d1nroen2t1gse2t3le1sko1rzo1sy2s1temszynkwa1to3y2o3tturbo1o2tygo2d1nwe1e1ke1we4s2t3fwe4s2t3m_bezac4h_bezami1_gdzi2e1_inacze1_półac4h_półami1_przyna1",
        9: "_ad5a2p1t_bezo2b1j_czte1re1_długo3w2_do5m4k2n_drogo3w2_dwó3j4a1_dwó3j4ą1_dwó3j4e1_dwó3j4ę1_dwó3j4o1_dy3s4ta1_dzi1esi1_dzi1ewi1_elektro1_grubo3w2_hipe1re2_in4f3lan_jadło3w2_kilkuse1_kon2t2r3_ko1ntro2_możno3w2_na3d4łub_na3d4r2w_na3d4ruk_na3d4r4z_nado1bo1_nado2l1b_nadzi2e1_na4j3e2f_na4j3e2g_na4j3e2n_na4j3e2r_na4j3e2s_na4j3e2w_na1deta1_nade4p3c_nade4p3n_nade4p3t_nadec4h2_nadec4z2_naded4z2_naded4ź2_naded4ż2_nader4z2_nades4z2_naj3a2u1_naj3o2b2_naj3o2c2_naj3o2ć2_naj3o2d2_naj3o2f2_naj3o2g2_naj3o2h2_naj3o2k2_naj3o2l2_naj3o2ł2_naj3o2m2_naj3o2p2_naj3o2r2_naj3o2s2_naj3o2ś2_naj3o2t2_naj3o2w2_naj3o2z2_naj3o2ź2_naj3o2ż2_najbe2z3_najbezw2_najdo3b2_najdo3c2_najdo3ć2_najdo3d2_najdo3f2_najdo3g2_najdo3h2_najdo3k2_najdo3l2_najdo3ł2_najdo3m2_najdo3p2_najdo3r2_najdo3s2_najdo3ś2_najdo3t2_najdo3w2_najdo3z2_najdo3ź2_najdo3ż2_najob3h2_najob3j2_najob3l2_najob3ł2_najob3w2_najoc4h2_najoc4z2_najod3h2_najod3j2_najod3l2_najod3w2_najod5ż2_najod4z2_najod4ź2_najor4z2_najos4z2_naj2t1k2_naj2t1r2_najuc4z2_napo4m3p_napoc4h2_napoc4z2_napo4d3d_napod4ź2_napod4ż2_napor4z2_napos4z2_nie4d4ź3_niedo3b2_niedo3c2_niedo3ć2_niedo3d2_niedo3f2_niedo3g2_niedo3h2_niedo3k2_niedo3l2_niedo3ł2_niedo3m2_niedo3p2_niedo3r2_niedo3s2_niedo3ś2_niedo3t2_niedo3w2_niedo3z2_niedo3ź2_niedo3ż2_niedokr2_nieob3h2_nieob3j2_nieob3w2_nieoc4h2_nieoc4z2_nieod3h2_nieod3j2_nieod3l2_nieod3ł2_nieod5ż2_nieod4z2_nieod4ź2_nieor4z2_nieos4z2_niepo2d2_niepo3b2_niepo3c2_niepo3ć2_niepo3f2_niepo3g2_niepo3h2_niepo3k2_niepo3l2_niepo3ł2_niepo3m2_niepo3p2_niepo3r2_niepo3s2_niepo3ś2_niepo3t2_niepo3w2_niepo3z2_niepo3ź2_niepo3ż2_niepod5ż_nieposm2_niero2z3_nierozm2_niesu2b3_nie2t1k2_nieuc4z2_niewy3b2_niewy3c2_niewy3ć2_niewy3d2_niewy3f2_niewy3g2_niewy3h2_niewy3k2_niewy3l2_niewy3ł2_niewy3m2_niewy3p2_niewy3r2_niewy3s2_niewy3ś2_niewy3t2_niewy3w2_niewy3z2_niewy3ź2_niewy3ż2_niewytr2_o3b4luzg_o3b4r4z2_o3d4i2u1_o3d4rwi1_o3d4rzeć_o3d4rz2w_o4b5rzą1_o4b5rzez_o4b5rzęd_o4b5rzuc_o4b5rzut_o4b5rzyn_o4d7ziar_o4d7ziem_obe2r1ż2_obesc4h2_obe2t1k2_od3u2c4z_ode3m1k2_odepc4h2_ode2r1ż2_odetc4h2_ode2t1k2_o1gni2o1_o1gólno1_osie2m1s_o1śmi2o1_ośmio3ś2_pe4r5i2n_pe1e1se1_pee2se2l_pe1pe1e2_peze2t1p_pięci2o1_piono3w2_po3d4łu1_po3d4naw_po3d4rap_po3d4raż_po3d4roż_po3d4róż_po3d4ryg_po3d4waj_po3d4woj_po3d4wór_po3di2u1_po4c2z3d_po4c2z3t_podobra1_po4d3o2f_po4d3o2g_podokre1_podokrę1_podo2b1s_podo2l1b_po4d5zam_po4d5ze1_podzi2e1_po4s2t3d_po4s2t3f_po4s2t3g_po4st3i2_po4s2t3k_po4s2t3m_po4s2t3p_po1stro1_po4s2t3s_po5r4tę1_pochr4z2_podec4h2_podec4z2_poded4z2_poded4ź2_poded4ż2_pode2p1c_poder4z2_podes4z2_podro2z3_pona4f3t_ponac4h2_pona4d3d_ponad3h2_ponad3j2_ponad3l2_ponad4z2_ponar4z2_ponas4z2_ponaz3m2_ponie3k2_ponie3w2_póło2m2d_półprzy1_pra1pra1_przed3ł2_przedłu1_przedmu1_przed3o2_przed3r2_przedra1_przedru1_przedry1_przed3u2_prze3dą1_prze3dę1_prze3dy1_przedzi1_przec4h2_przec4z2_prze1de1_przed3h2_przed3i2_przed3j2_przed3l2_przedsi1_przed3w2_prze2p1c_przes4z2_przetra1_przyc4h2_przyc4z2_przyd4z2_przyd4ź2_przyd4ż2_przy2p1c_przys4z2_rozbr4z2_rozec4h2_rozec4z2_rozed4z2_rozed4ź2_rozed4ż2_roze2p1c_rozer4z2_rozes4z2_rozpo3w2_samo1ro1_siede2m3_si1edmi1_spo3d4z2_stere2o3_stereoa2_stereoi2_stereou2_supe1re2_sze4ś2ć3_sześ2ć1s_światło1_ta2r7zan_tra2n2s3_tran3s4z_tra1nsa2_tró3j4ą1_tró3j4ę1_tysią2c3_wielo3d2_wielo3k2_wielo3ś2_wszecho2_wy3o2d3r_wy4ż3s4z_wye2k2s3_za3o2b3r_za3o2b3s_za4r3c4h_za5m4k2n_zado2ść3_zadośću4_zanie3d2_zde3z4el_zde3z4er_zde3z4y1_zdyskre1_zdyskwa1_ze4t3hap_zmartwy1_znie4m3c_zniec4h2_zniec4z2_znied4z2_znied4ż2_znier4z2_znies4z2_zro3z4u18s8t8r8z_8szc8z8b_8z8d8r8z_be2f3s4z2bi2sz3kopbirmi2n1gblokha2u1broa1dwa1bu2sz3me1buk2s2z1pfi2sz3binfol2k1lorfo1sfazo1karlskro1lu2ks1fermie2r5z1łpo1rtsmo1portsmou2pre2s2z1proe1ntge1skorzone1szto1kho1vo2l2k2s3_byna2j1m_n8i9gdy__ni1gdzi1_niechby1_trójac4h_trójami1_podó2w1c",
        10: "_arcy3b1z2_auto3c4h2_a1utotra1_cienko3w2_czarno3k2_cztero3ś2_czwó3r4a1_czwó3r4ą1_czwó3r4e1_czwó3r4ę1_czwó3r4o1_ćwie2r2ć3_daleko3w2_długo3tr2_dziesi2ę1_dziewi2ę1_e1me1sze1_elektroa2_elektroi2_elektrou2_hipe3r4o1_kon3tr4a1_kon3tr4e1_kon3tr4y1_krótko3w2_nadre2p1c_na3ja2z1d_nado1bro1_nadoki2e1_na4d5rzą1_na4d5rzę1_na4d5rzy1_na4d5ziem_na4j3e2u1_nad3e2tat_nad5z2mys_nade2r1ż2_nadśrod4z_naj3a2k1t_naj3ro2z3_najdoc4h2_najdoc4z2_najdod4z2_najdod4ź2_najdod4ż2_najdor4z2_najdos4z2_najo2b3c2_najo2b3ć2_najo2b3d2_najo2b3f2_najo2b3g2_najo2b3k2_najo2b3m2_najo2b3n2_najo2b3p2_najo2b3s2_najo2b3ś2_najo2b3t2_najo2b3ź2_najo2b3ż2_najobc4h2_najobc4z2_najobd4z2_najobd4ź2_najobd4ż2_najobr4z2_najobs4z2_najo2d3c2_najo2d3ć2_najo4d3d2_najo2d3f2_najo2d3g2_najo2d3k2_najo2d3m2_najo2d3n2_najo2d3p2_najo2d3s2_najo2d3ś2_najo2d3t2_najodc4h2_najodc4z2_najodd4z2_najodd4ź2_najodd4ż2_najods4z2_napo2m1k2_niedoc4h2_niedoc4z2_niedod4z2_niedod4ź2_niedod4ż2_niedo2p1c_niedor4z2_niedos4z2_nieo2b3c2_nieo2b3ć2_nieo2b3d2_nieo2b3f2_nieo2b3g2_nieo2b3k2_nieo2b3m2_nieo2b3p2_nieo2b3s2_nieo2b3ś2_nieo2b3ź2_nieo2b3ż2_nieobc4h2_nieobc4z2_nieobd4z2_nieobd4ź2_nieobd4ż2_nieobs4z2_nieo2d3c2_nieo2d3ć2_nieo4d3d2_nieo2d3f2_nieo2d3g2_nieo2d3k2_nieo2d3n2_nieo2d3p2_nieo2d3s2_nieo2d3ś2_nieo2d3t2_nieod3w1r_nieodc4h2_nieodc4z2_nieodd4z2_nieodd4ź2_nieodd4ż2_nieods4z2_niepod3ł2_niepodmu1_niepod3r2_niepodra1_niepodrę1_niepod3w2_niepodwa1_niepo3do1_niepo3du1_niepoc4h2_niepoc4z2_niepod3h2_niepod3j2_niepod3l2_niepodsm2_niepor4z2_niepos4z2_nie1prze1_niero2z1t_nieroztr2_ni1esubi1_niewyc4h2_niewyc4z2_niewyd4z2_niewyd4ź2_niewyd4ż2_niewyr4z2_niewys4z2_o2t3c2h2ł_o3b4raso1_o3d4robin_o3d6zi2a1_o3d6zi2e1_o4b5łoc4z_o1d3i2zo1_ognio3tr2_ogólno3k2_osie1mse1_pełno3kr2_pierwo3w2_pięcio3ś2_pięćse2t3_płasko3w2_podre2p1c_po3d4rętw_po3d4ruzg_po3d4rze1_po3d4woi2_po3e2k2s3_podobi2a1_po1do1bo1_podoki2e1_podopi2e1_po4d5zakr_po4d5zast_po4d5zbi1_po4d5ziem_po1dzi2o1_po4d5ziom_po4st3rom_pod3a2l1p_pode3t1k2_podepc4h2_pode2r1ż2_podesc4h2_pona3c4z2_po1na3do1_pona3d4ź2_ponabr4z2_pona2d3c2_pona2d3ć2_pona2d3f2_pona2d3g2_pona2d3k2_pona2d3p2_pona2d3s2_pona2d3ś2_pona2d3t2_poro3z4u1_pó3ł4ec4z_pra3w2nu1_prze2d3m2_prze3d4um_prze3d4z2_prze3d4ź2_prze4d5zj_przedzwo1_prze4d5ż2_przec2h2r_przeci2w3_przeciwa2_przedago1_prze2d3b2_prze2d3c2_prze2d3ć2_prze4d3d2_prze2d3f2_prze2d3g2_prze2d3k2_prze2d3n2_prze2d3p2_prze2d3s2_prze2d3ś2_prze2d3t2_przedc4h2_przedc4z2_przedd4z2_przedd4ź2_przedd4ż2_prze2ł1k2_prze2m1k2_przepc4h2_pr4zer4z2_prze2r1ż2_przesc4h2_prze2t1k2_przy2m1k2_przypc4h2_pr4zyr4z2_przy2r1ż2_przysc4h2_przy2t1k2_ro3z4e3b2_ro3z4e3c2_ro3z4e3ć2_ro3z4e3d2_ro3z4e3f2_ro3z4e3g2_ro3z4e3h2_ro3z4e3k2_ro3z4e3l2_ro3z4e3ł2_ro3z4e3m2_ro3z4e3p2_ro3z4e3r2_ro3z4e3s2_ro3z4e3ś2_ro3z4e3t2_ro3z4e3w2_ro3z4e3z2_ro3z4e3ź2_ro3z4e3ż2_rozepc4h2_roze2r1ż2_rozesc4h2_samo3c4h2_samoro2z3_siede2m1s_siedmi2o1_ską2d5że1_stereo1o2_su3b4i2e1_supe3r4at_sze1ś2ci1_sześci2o1_sze1śćse1_tran3s4e1_tran3s4y1_trze2c4h3_tysią3c4z_we4s3pr4z_wie1luse1_wilczo3m2_wniebo3w2_wspó2ł1w2_wsze2c4h3_wy4cz3ha1_ze1te1me1_ze1te1se1_zimno3kr2_znie4d4ź3bi2n3o2ku1birmingha1blo2k1hauzbuk2sz3panbusine2s2sdeutsc2h2ldeutschla1du2sz3pasthu2x3le2y1kongre2s3mluftwa4f3fmi1e2r5zi1mon2t3realmurzasic4hpa2n3a2merpoli3u2re1połu3d2ni1powsze2d1npre2sz3pa1ro2k3roc4zsy2n3o2p1tsza2sz1ły1szyn2k1wasturboodr4ztygo3d2ni1_bynaj2m1n_bynajmni1_be9z8ami__gdzi1eni1_n8a9da8l__nigdzi2e1_nie2c2h1ż_nie1chże1_nie2c2h1b_ow9sze8m__pó9ł8ami__pó9ł8e8k__ską1diną1_podówcza1",
        11: "_ciepło3kr2_de3z4a3bil_de3z4a3wu1_dziewię2ć3_elektro1o2_kilkuse2t3_kilkuseto2_kon3tr4o3l_kon3tr4o3w_krótko3tr2_mili3a2m1p_na3d4muc4h_na3d4ręc4z_na4d3o2b2ł_nadobo2j1c_na4j3e2k2s_na4j3e2ko1_na4j3e2m1f_nad5zwyc4z_nadśrodzi1_najdo2t1k2_najro3z4u1_niedobr4z2_niedo2m1k2_niedopc4h2_niedo2t1k2_niepo2d3m2_nie1podre1_niepo1dwo1_niepo3d4z2_niepo3d4ź2_niepodoc4h_niepo2d3b2_niepo2d3c2_niepo2d3ć2_niepo4d3d2_niepo2d3f2_niepo2d3g2_niepo2d3k2_niepo2d3n2_niepo2d3p2_niepo2d3s2_niepo2d3ś2_niepo2d3t2_niepodc4h2_niepodc4z2_niepodd4ź2_niepodd4ż2_niepods4z2_nieprze2d2_nieprze3b2_nieprze3c2_nieprze3ć2_nieprze3f2_nieprze3g2_nieprze3h2_nieprze3k2_nieprze3l2_nieprze3ł2_nieprze3m2_nieprze3n2_nieprze3p2_nieprze3r2_nieprze3s2_nieprze3ś2_nieprze3t2_nieprze3w2_nieprze3z2_nieprze3ź2_nieprze3ż2_nieprzekl2_nieprzekr2_nieprzesm2_nieprzetr2_niero3z4u1_nieroze3r2_niero2z1ś2_niewybr4z2_niewy2t1k2_ob3o2str4z_osiemse2t3_pe1ze1tpe1_po3d4muc4h_po3d4r2wi1_po3d4ręc4z_po3d4roba1_po3d4robó1_po3d4roby1_po3d4roc4z_po3d4wor4z_podobo2j1c_po4d3o2bóz_po1do1cho1_po4d3o2d1m_po4d3o2k1n_po4d3o2ryw_podosi1ni1_po4d3obs4z_po4d3o4d3d_po4d3u2c4z_po4d3u2d4z_po4d3u2pa1_po4d3u2ral_podu2s2z1c_podzie1le1_po4d5z2w2r_poduszczy1_pod3śró2d5_ponad3c4h2_ponad3c4z2_ponad3d4ź2_prapra2w1n_prze3d4łuż_prze3d4ruk_prze3d4ryl_przedłuży1_przedosta1_prze4d5za1_prze4d5zim_prze4d5z1l_pr4zebr4z2_przeci1wi1_przedsi2ę1_przed3s4z2_pr4zegr4z2_pr4zygr4z2_retra2n2s3_ro4z5a2gi1_ro4z5e2mo1_ro4z5e4g3z_ro4z5e4n3t_siedmio3ś2_ste1re1oe2_su3b4o2t1n_supe2r5z2b_superodr4z_sześcio3ś2_sześćse2t3_światło3w2_tró3j4ec4z_trze2c2h1s_trze1chse1_tysią3c4a1_tysią3c4e1_tysią4c5zł_we4s3tc4h2_wieluse2t3_współo2b3w_wszec2h2w2_zady2s3po1_zde3z4awu1_zdy2s3kred_zdy2s3kwal_ze4t3e2m1pbe2k1he2n1dbi2z3ne2s3mbusine2ss3mfi2s3ha2r1mfos2f1a2zotga1do3p2ta1gran2d1ilo1karl2s1kronna4ł3ko2w1soch3mistr4zro2e3nt2genro2s3to3c2ksko2r5zoner_n8i9gdzie__nie8ch9że__nie8ch9by__przyna2j1m_tró9j8ami__tró9j8e8k__podó4w3c4z",
        12: "_cztere2c4h3_dziewię2ć1s_e2s1e2s1ma1_e1le1ktroe2_na3d4repc4z_na3d4re2p1t_na3d4wo2r1n_na4d3o2brot_na4d3o2dr4z_na4d3o2kien_na4d3olbr4z_na4d5rzec4z_niepo3d4łu1_niepo3d4rap_niepo3d4raż_niepo3d4waj_niepo3d4woj_nieprzed3ł2_nieprzedłu1_nieprzedmu1_nieprzed3r2_nieprzedra1_nieprzedru1_nieprzedry1_nieprzed3u2_nieprze3dy1_nie1prze1e2_nieprzec4h2_nieprzec4z2_nieprzed3h2_nieprzed3j2_nieprzed3l2_nieprzed3w2_nieprze2p1c_nieprzes4z2_nie1ro3z4e1_nierozbr4z2_po3d4repc4z_po3d4re2p1t_po3d4ro1bo1_po3d4wó2j1n_po4d3e4k2s3_po4d3o2biad_po4d3o2braz_po4d3o2choc_po4d3o2kien_po4d3o2kres_po4d3o2kręg_podosini2a1_po4d3olbr4z_po4d3u2sta1_półprzy3m2k_predy2s3po1_prze3d4o3br_prze3d4o3st_przedra1ma1_prze3e2k2s3_prze4d5z1g2_prze4d5zwoj_pr4zechr4z2_przeci4w3w2_przed3a2gon_przed3a2k1c_przed3a2l1p_przed3e2g1z_prze1de1me1_przed3e2mer_pr4zedgr4z2_sie1de1mse1_siedemse2t3_supe3r4i2o1_supe4r5a2tr_tran3s4i2e1_tran4s5e2u1_trzechse2t3_wewną2tr4z3birmin2g1hamcal2d1we4l3lin4nsbru2c1kkarl2s1ruhe1kir2chho4f3flu2ft3waffe1mi2s4z1mas4zpo3d4niepr4zpo4rt3la2n1dpowsze3d2ni1sze2z1lo2n1gtu1rboodrzu1we2e2k1e2n1d_bynajmni2e1_be9z8a8c8h__in8a9cze8j__pó9ł8a8c8h__przynaj2m1n_przynajmni1_podó3w2czas",
        13: "_autotra2n2s3_cztere2c2h1s_dzi1esi1ęci1_dziesięci2o1_dzi1ewi1ęci1_dziewięci2o1_dzie1więćse1_e2m3e2s5ze2t_kon4tr5a2gi1_kon4tr5a2se1_kon4tr5a2sy1_kon4tr5a2ta1_kon4tr5a2d1m_kon4tr5a2k1c_kon4tr5a2l1t_kon4tr5a2r1g_na4d3o2bowi1_nadśrodzi2e1_nadśrod5ziem_niepodre2p1c_nieprze2d3m2_nieprze3d4um_nieprze3d4z2_nieprze3d4ź2_ni1eprzedzi1_nieprze4d5zj_nieprzedzwo1_nieprze4d5ż2_nieprze2d3c2_nieprze2d3ć2_nieprze4d3d2_nieprze2d3f2_nieprze2d3g2_ni1eprzed3i2_nieprze2d3k2_nieprze2d3n2_nieprze2d3p2_nieprze2d3s2_nieprze2d3ś2_nieprze2d3t2_nieprzedc4h2_nieprzedc4z2_nieprzedd4z2_nieprzedd4ź2_nieprzedd4ż2_nieprze2ł1k2_nieprzepc4h2_niepr4zer4z2_nieprze2r1ż2_nieprzesc4h2_nieprze2t1k2_pe1ze1tpe1e2_peze2t1pee2r_po4d3o2str4z_po4d3u2szc4z_po4d5rę2cz1n_podzi1eleni1_po5d4uszczyn_prapra3w2nu1_prze3d4muc4h_prze3d4o3zo1_prze3d4ramat_pr4ze3d4r4z2_prze4d5łużyc_prze4d5z2w2r_przed3się3w2_przedy2s3ku1_przetra2n2s3_ro4z5a2ni2e1_su1perodrzu1_zdy2s3ko2n1t_ze4t3e2m1e2s_ze4t3e2s1e2l_zmartwy2c4h3bro2a2d3wa2y1szto2k1ho2l1mturboo2d3rzut_gdzi2e1ni2e1_skąd9i8ną8d__tró9j8a8c8h_",
        14: "_czte1re1chse1_czterechse2t3_dziesięcio3ś2_dziewięcio3ś2_dziewięćse2t3_na4d3o2bojc4z_niepo3d4muc4h_niepo3d4ręc4z_niepo1do1cho1_nieprze3d4łuż_nieprze3d4ruk_nieprze3d4ryl_nieprzedłuży1_nieprze4d5zim_nieprze4d5z1l_nieprzed3s4z2_niepr4zegr4z2_po4d3o2bojc4z_po4d3o2piec4z_po4d3o2siniak_po4d5zielenic_po4d5zielenić_po4d5zielenil_po4d5zielenił_po4d5zielenim_po4d5zielenis_prze4d5o4stat_supero2d1rzut_zmartwyc2h2w2mu2r7zasic2h3lpo4rt2s3mo2uth_gd4zieniegd4z_przynajmni2e1",
        15: "_niepo3d4repc4z_niepo3d4re2p1t_niepo4d3o2choc_niepr4ze3br4z2_nieprzedra1ma1_nieprze3e2k2s3_nieprze4d5z2a1_nieprze4d5z1g2_nieprze4d5zwoj_ni2e1su3b4i2e1_po4d5zielenien_prze1ci3w4i2e1deut4sch3la2n1d_2g1dzienie2g1d",
        16: "_niepo4d3o2str4z_nieprze3d4muc4h_nieprze3d4ramat_niepr4ze3d4r4z2_nieprze4d5łużyc_nieprze4d5z2w2r_po4d5zieleni2ą1_po4d5zieleni2ę1_po4d5zieleni2o1_by9naj9m8nie8j__gdzi1eni1egdzi1",
        17: "_podzi2e1le1ni2e1_gdzienie9g8dzie__po8d9ó8w9cza8s_",
        18: "_przy9naj9m8nie8j_",
        20: "_gdzi2e1ni2e1gdzi2e1"
    },
    patternChars: "_abcdefghijklmnoprstuvwxyzóąćęłńśźż",
    patternArrayLength: 84001,
    valueStoreLength: 29625
};


Hyphenator.config({
	classname : 'h',
	donthyphenateclassname : 'nh',
	urlclassname : 'uh',
	useCSS3hyphenation : true
});

Hyphenator.run();