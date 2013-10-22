//language variable
var MSG_JS={};

//url's
var syncBaseURL = "http://lexicon.on-lingua.org/"; //add sync-something.php to it

//importer
var NUM_SAMPLE_CARDS = 3; //# sample cards to show when importing

//feedback
/**
 * @type Number
 * We ask for feedback once it has been this many days since we last asked, or after FB_MIN_USES uses. Whichever comes first.
 */
var FB_MIN_DAYS = 15;
/**
 *@type Number
 * We ask for feedback once the user has used Cabra this many times since we last asked, or after FB_MIN_DAYS days. Whichever comes first.
 */
var FB_MIN_USES = 25;

//card manager
var CHUNK_SIZE = 50; //#cards in a chunk; this many are added at once. if it lags reduce this
var BREAK_TIME = 500; //how long, in ms, to wait between chunks. if it lags increase this.

//interface
var FADE_SPEED = 300; //ms it takes to fade html in/out

/* API */
//Quizlet - https://quizlet.com/api_dashboard/
var QUIZLET = {
    clientID: "FQZUmRBsfq",
	maxToLoad: 20 //most projects to show user to choose from when searching; Quizlet only allows us to do 50
}
//standard starting bits for URLS to make api requests
QUIZLET.api = {
    //Search for a set of cards. Tack on the search term (url encode if you want). EG http://is.gd/x3fWZR
    //Grab the ID of the set from RESPONSE.sets[0].id; get specifics with getSet
    searchSets: "https://api.quizlet.com/2.0/search/sets?client_id=" + QUIZLET.clientID + "&whitespace=1&per_page=" + QUIZLET.maxToLoad +"&q=",
    
    //If you know the ID of a set (got from searchSets), get the actual cards here. EG http://is.gd/8egN0i
    //tack id on to end
    //Grab cards with RESPONSE.terms (array of objects with .term and .definition)
    getSet: "https://api.quizlet.com/2.0/sets?client_id=" + QUIZLET.clientID + "&id="
}

/* Enums */
var StudyResult = {
    YES: {id: 1},
    SORT_OF: {id: 2},
    NO: {id: 3},
    SKIPPED: {id: 4}
};

var StudyMode = {
    NORMAL: "normal",
    CRAM: "cram",
    PERFECTION: "perfection"
};
var StudyStyle = {
     NORMAL: "normal",
     JEOPARDY: "jeopardy",
     RANDOM: "random"
};
var CardParts = {
     QUESTION: "question",
     ANSWER: "answer"
};

var FontSize = {
     SMALL:    18,
     MEDIUM:   32,
     LARGE:    44,
     XLARGE:   64     
};

//save/load
var SL_KEYS = {
    PROJECTS: "lexicon-projects",
    OPTIONS: "lexicon-options",
    SYNC_KEY: "lexicon-sync-key",    
};

var Rank = {	
    A: { id: 1, name: "A", baseReps: 0,  color: "#CC0000" },
    B: { id: 2, name: "B", baseReps: 2,  color: "#CC6600" },
    C: { id: 3, name: "C", baseReps: 5,  color: "#339900" },
    D: { id: 4, name: "D", baseReps: 9,  color: "#00CC33" },
    E: { id: 5, name: "E", baseReps: 14, color: "#00DD66" },
	F: { id: 6, name: "F", baseReps: 20, color: "#00FF99" }
};

function nextRank(rank){
    switch(rank){
        case Rank.A: return Rank.B;
        case Rank.B: return Rank.C;
        case Rank.C: return Rank.D;
        case Rank.D: return Rank.E;
        case Rank.E: return Rank.E;
    }
}

//theme
var Theme = {
    //maps name -> css/slug
    BLUE:   "blue",
    GREEN:  "green",
    RED:    "red",
    BLACK: 	"black"
    //PURPLE: "purple"
}
