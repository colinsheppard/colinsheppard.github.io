function Ai() {
    this.init = function() {
        // This method is called when AI is first initialized.
    }

    this.restart = function() {
        // This method is called when the game is reset.
    }

    this.step = function(grid) {
        // This method is called on every update.
        // Return one of these integers to move tiles on the grid:
        // 0: up, 1: right, 2: down, 3: left

        // Parameter grid contains current state of the game as Tile objects stored in grid.cells.
        // Top left corner is at grid.cells[0][0], top right: grid.cells[3][0], bottom left: grid.cells[0][3], bottom right: grid.cells[3][3].
        // Tile objects have .value property which contains the value of the tile. If top left corner has tile with 2, grid.cells[0][0].value == 2.
        // Array will contain null if there is no tile in the slot (e.g. grid.cells[0][3] == null if bottom left corner doesn't have a tile).

        // Grid has 2 useful helper methods:
        // .copy()    - creates a copy of the grid and returns it.
        // .move(dir) - can be used to determine what is the next state of the grid going to be if moved to that direction.
        //              This changes the state of the grid object, so you should probably copy() the grid before using this.
        //              Naturally the modified state doesn't contain information about new tiles.
        //              Method returns true if you can move to that direction, false otherwise.
	
	var bestScore = this.getScore(grid,1);
	var bestMove = -1;
	var i;
	for(i = 0; i < 4; i++){ 
	  var newscore = this.scoreMove(i,grid,1);
	  if(newscore>bestScore){
	    bestScore = newscore;
	    bestMove = i;
	  }
	}

	// If nothing improves score, just pick any valid move
	if(bestMove == -1){
	  console.log("finding valid move");
	  bestMove = 0;
	  for(i = 0; i < 4; i++){ 
	    var newgrid = grid.copy();
	    var validMove = newgrid.move(i);
	    if(validMove){
	      bestMove = i;
	    }
	  }
	}

	/*console.log("best score: "+bestScore+" move:"+bestMove);*/
        return bestMove;
    }
    this.scoreMove = function(move,grid,depth){
      var newgrid = grid.copy();
      var validMove = newgrid.move(move);
      var score = this.getScore(newgrid,depth);
      var i;
      if(validMove && depth<5){
	for(i = 0; i < 4; i++){ 
	  var newscore = this.scoreMove(i,newgrid,depth+1);
	  if(newscore>score){
	    score = newscore;
	  }
	}
      }
      console.log("move: "+move+" valid? "+validMove+" depth: "+depth+" score: "+score);
      return score;
    }
    this.getScore = function(grid,depth){
      var score = 0;
      var i;
      var j;
      var numEmpty = 0;
      var maxCell = null;
      for(i = 0; i<4; i++){
	for(j = 0; j<4; j++){
	  if(grid.cells[i][j]!=null){
	    var exp = 1.1;
	    if(i<3){
	      var newExp = this.getExp(grid.cells[i][j],grid.cells[i+1][j],depth);
	      exp = (newExp > exp) ? newExp : exp;
	    }
	    if(i>0){
	      var newExp = this.getExp(grid.cells[i][j],grid.cells[i-1][j],depth);
	      exp = (newExp > exp) ? newExp : exp;
	    }
	    if(j<3){
	      var newExp = this.getExp(grid.cells[i][j],grid.cells[i][j+1],depth);
	      exp = (newExp > exp) ? newExp : exp;
	    }
	    if(j>0){
	      var newExp = this.getExp(grid.cells[i][j],grid.cells[i][j-1],depth);
	      exp = (newExp > exp) ? newExp : exp;
	    }
	    score += Math.round(Math.pow(grid.cells[i][j].value,exp));
	    if(maxCell==null)maxCell = grid.cells[i][j];
	    if(grid.cells[i][j].value > maxCell.value)maxCell = grid.cells[i][j];
	  }else{
	    numEmpty++;
	  }
	}
      }
      var bonus = numEmpty/100;
      if(maxCell.x + maxCell.y == 0 || maxCell.x + maxCell.y == 6 || (maxCell.x + maxCell.y == 3 && (maxCell.x == 0 || maxCell.y == 0))){
	bonus += 0.1;
      }
      return Math.round(Math.pow(score,1 + bonus));
    }
    this.getExp = function(cell1,cell2,depth){
	var exp = 1.1;
	if(cell2!=null){
	  if(Math.round(cell1.value / 4)  == cell2.value){
	    exp = 1.15;
	  }else if(Math.round(cell1.value / 2) == cell2.value){
	    exp = 1.2;
	  }else if(cell1.value == cell2.value){
	    exp = 1.3;
	  }
	}
	return exp - 2*depth/100;
    }
}
