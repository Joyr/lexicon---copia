// JavaScript Document 
// CONSTANTS
var MSG_JS={};

var MISSING="missing";

//importer
var NUM_SAMPLE_CARDS = 3; //# sample cards to show when importing

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

//Opciones para el formulario
var option = {
	ADD: true,
	EDIT: false
};

//Acciones para proyectos y flashcards
var action ={
	ADD: 	{ id: 1 },
	EDIT: 	{ id: 0 },
	DELETE: { id: -1}
};

//Distintos rangos
var Rank = {	
    A: { id: 1, name: "Rank A", baseReps: 0,  color: "#CC0000" },
    B: { id: 2, name: "Rank B", baseReps: 2,  color: "#CC6600" },
    C: { id: 3, name: "Rank C", baseReps: 5,  color: "#339900" },
    D: { id: 4, name: "Rank D", baseReps: 9,  color: "#00CC33" },
    E: { id: 5, name: "Rank E", baseReps: 14, color: "#00DD66" },
	F: { id: 6, name: "Rank F", baseReps: 20, color: "#00FF99" },
	NO: { id:0, name: "No studied", baseReps:0, color: "#000000" }
};

function nextRank(rank){
    switch(rank){
        case Rank.NO: return Rank.A;
        case Rank.A: return Rank.B;
        case Rank.B: return Rank.C;
        case Rank.C: return Rank.D;
        case Rank.D: return Rank.E;
        case Rank.E: return Rank.F;
		case Rank.F: return Rank.F;
    }
}

function returnRank(id){
	switch(id){
		case '1': return Rank.A;
		case '2': return Rank.B;
		case '3': return Rank.C;
		case '4': return Rank.D;
		case '5': return Rank.E;
		case '6': return Rank.F;
		default: return Rank.NO;
	}	
}

//theme
var Theme = {
    //maps name -> css/slug
    BLACK: "black",
	BLUE:   "blue",
    GREEN:  "green",
    RED:    "red"
}

