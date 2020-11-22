import { Injectable } from '@angular/core';
import { Admin } from './models/admin';
import { ACSession } from './models/acSession';
import { Player } from './models/player';
import { Team } from './models/team';
import { templateSourceUrl } from '@angular/compiler';
import { runInThisContext } from 'vm';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { database } from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  public currentPlayer: Player;
  public admin : Admin;
  public session: ACSession = new ACSession();
  public sprintCounter = 0;

  constructor(public db: AngularFireDatabase) {
    this.saveAdmin();
    this.loadAdmin();
  }

  post(collection: string, data: object) {
    this.db.object(collection).set(data); //DB
    //localStorage.setItem(collection, JSON.stringify(data)); //LocalStorage
  }

  get(src: string) {
    return this.db.object(src).snapshotChanges();
  }

  saveAdmin(){
    let admin = new Admin ('esteban', '1234');
    this.post('adminInfo', admin);
  }

  loadAdmin(){
    var adminData = null;
    this.get('adminInfo').subscribe( action => {
      adminData = action.payload.val()
      this.admin = adminData;
    });
  }

  savePlayerToLocalStorage(playerName: string, isProductOwner: boolean, teamNumber) {
    this.currentPlayer = new Player(playerName, isProductOwner, teamNumber);
    this.post('currentUser', this.currentPlayer);
  }
  
  loadPlayer() {
    var currentUserData = null;
    this.get('currentUser').subscribe( action => {
      currentUserData = action.payload.val()
      this.currentPlayer = currentUserData;
    });
  }

  saveSession(session: ACSession) {
    console.log('save Session: ')
    console.log(session);
    this.post('session', session);
  }

  loadSession() {
    var sessionData = null;
    this.get('session').subscribe( action => {
      sessionData = action.payload.val()
      this.session = sessionData;
    });
  }

  updateSessionTeams(team: Team) {
    let session = this.session;
    for (let i = 0; i < this.session.teams.length; i++) {
      if (team.identifier == this.session.teams[i].identifier) {
        this.session.teams[i] = team
      }
    }
    this.post('session', session);
  }

  addPlayerToTeam(player: Player, team: Team) {
    if (this.currentPlayer.identifier == player.identifier) {
      this.currentPlayer.teamNumber = team.teamNumber;
      this.post('currentUser', this.currentPlayer);
    }

    // let newTeam = new Team(team.teamNumber);
    // newTeam.identifier = team.identifier;
    // newTeam.pizzas = team.pizzas;
    // newTeam.teamNumber = team.teamNumber;
    // newTeam.players = team.players;
    // //this.checkUserTeam(player.identifier)
    // newTeam.addPlayer(player);
    // //this.updateSessionTeams(newTeam);

  }

  removePlayerFromTeam(player: Player, team: Team) {
    if (this.currentPlayer.identifier === player.identifier) {
      player.teamNumber = null;
      this.post('currentUser', player);
    } else {
      console.log('false');
    }

    // this.findanddelete(player.identifier, team.identifier);

    // var newTeam = new Team(team.teamNumber)

    // for (let i = 0; i < team.players.length; i++) {
    //   if (player.identifier == team.players[i].identifier) {
    //     console.log('got em chief');
    //     team.players.splice(i, 1);
    //     newTeam = team.players[i];
    //   }
    // }

    //this.updateSessionTeams(newTeam);
  }

  getMinAndMaxPlayers() {
    var teams = this.session.teams;
    for (let i = 0; i < this.session.teams.length; i++) {
      for (let j = 0; j < teams[i].players.length; j++) {
        var teamTotal = teams[i].players[j];
        console.log('team total:' + teamTotal);
      }
    }
  }


  checkUserTeam(identifier) {
    var teams = this.session.teams;

    for (let i = 0; i < teams.length; i++) {
      for (let j = 0; j < teams[i].players.length; j++) {
        var playerFound = teams[i].players[j];
        if (playerFound.identifier == identifier) {
          teams[i].players.splice(j, 1);
        }
      }
    }
  }

  findanddelete(pidentifier, tidenfitier) {
    var teams = this.session.teams;

    for (let i = 0; i < this.session.teams.length; i++) {
      if (this.session.teams[i].identifier == tidenfitier) {
        var foundTeam = this.session.teams[i];
        for (let t = 0; t < foundTeam.players.length; t++) {
          if (foundTeam.players[t].identifier == pidentifier) {
            foundTeam.players.splice(t, 1);
          }
        }
      }
    }
  }
}
