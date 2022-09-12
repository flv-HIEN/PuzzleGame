const GameDifficulty=[20,50,70];
class Game{
    difficulty;//cette variable fait reference a la difficulte du jeux
    cols=3;//nombre de colonnes
    rows=3;//nombres de lignes
    count;//contient le nombre de colonnes*nombres de lignes
    blocks;//contient tous les div du puzzle className="puzzle_block"
    emptyBlockCoords=[2,2];//ici on a les coordonnees du block vide
    indexes=[];//tableau contenant lordre des blocks si on effectue un dplacement
    constructor(difficultyLevel=1){//niveau de difficulte initialiser a 1
        this.difficulty=GameDifficulty[difficultyLevel-1];//this.difficulty= 20
        this.count=this.cols*this.rows;//this.count=9
        this.blocks=document.getElementsByClassName("puzzle_block");//blocks contient un tableau dobjet des divs
        console.log(this.blocks);//affichage du contenu de blocks
        this.init();//appel de la fonction init() permet de placer chaue block dans sa position
    }
    init(){//positionne chaque block dans sa position
        for(let y=0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                let blockIdx=x+y*this.cols;
                console.log("position du block "+blockIdx);

               //  console.log("id du bloc "+blockIdx);
                if(blockIdx+1>=this.count)break;
                let block=this.blocks[blockIdx];//selectionne le block correspondant
               //  console.log("le block correspondant du div" );
                console.log("apel de la fonction positionBlockAtCoord () pour la position du bloc");
                 //on fait passer en passer en parametre le block correspondant
                this.positionBlockAtCoord(blockIdx,x,y);
               //  console.log("apel d la fonction onClickOnBlock  lorsquon click sur le block");
               //  console.log(" en faisant passer lid du block qui est "+blockIdx);
               block.addEventListener('click',(e)=>this.onClickOnBlock(blockIdx));

                this.indexes.push(blockIdx);//contient les cles de chaque block
                console.log(this.indexes);
            }
        }
        this.indexes.push(this.count-1);
        console.log(this.indexes);
        this.randomize(this.difficulty);
        //change la position des blocks lorsquon actualise et la position de chque block es recupere de nouveau

    }

    randomize(iterationCount){

      //permer davoir une nouvelle disposition des blocks a chaque fois quon actualise
        for(let i=0;i<iterationCount;i++){
            let randomBlockIdx=Math.floor(Math.random()*(this.count-1));
            // console.log(" position du block "+randomBlockIdx+" dans le div corespond au block ");
            // console.log("valeur aleatoire dla fonction randomize "+randomBlockIdx);
            let moved=this.moveBlock(randomBlockIdx);//apel de la fonction moveBlock pr deplacer chaque block a chaque actualisation
            // console.log(moved);

            if(!moved)i--;//si possible de deplacer on decrement et la boucle sarrete
        }
    }

    moveBlock(blockIdx){//moves a block and return true if the block has moved

      console.log("la fonction moveBlock est appelee sur le block");

        let block=this.blocks[blockIdx];//on selection le block correspondant 
      //   console.log( "qui a pour idxblock "+blockIdx);

        let blockCoords=this.canMoveBlock(block);//apel de la fonction canMoveBlock(block) si on peut deplacer le block correspondant
        if(blockCoords!=null){
            this.positionBlockAtCoord(blockIdx,this.emptyBlockCoords[0],this.emptyBlockCoords[1]);
            this.indexes[this.emptyBlockCoords[0]+this.emptyBlockCoords[1]*this.cols]=this.indexes[blockCoords[0]+blockCoords[1]*this.cols];
            this.emptyBlockCoords[0]=blockCoords[0];
            // console.log(this.emptyBlockCoords[0]);
            this.emptyBlockCoords[1]=blockCoords[1];
            // console.log(this.emptyBlockCoords[1]);

            return true;
        }
        return false;
    }
    canMoveBlock(block){//return the block coordinates if he can move else return null

        let blockPos=[parseInt(block.style.left),parseInt(block.style.top)];
          let blockWidth=block.clientWidth;
        let blockCoords=[blockPos[0]/blockWidth,blockPos[1]/blockWidth];

        let diff=[Math.abs(blockCoords[0]-this.emptyBlockCoords[0]),Math.abs(blockCoords[1]-this.emptyBlockCoords[1])];

        let canMove=(diff[0]==1&&diff[1]==0)||(diff[0]==0&&diff[1]==1);
      //   console.log("on verifie si on peut deplacer le block de coordonee "+canMove);
        if(canMove){
         
         return blockCoords;
         }
            else{ 
            return null;
         }
    }

    positionBlockAtCoord(blockIdx,x,y){//position the block at a certain coordinates

      let block=this.blocks[blockIdx];//selectionne le block correspondant
        block.style.left=(x*block.clientWidth)+"px";//ici on obtient sa position par rapport a gauche

        block.style.top=(y*block.clientWidth)+"px";//ici on obtient sa position par rapport au haut
      }      


    onClickOnBlock(blockIdx){//try move block and check if puzzle was solved
      // console.log("la fonction est appele et verifie si le puzzle est resolu en faisant apel ala fonction moveBlock() en donnant comme parametre le numero du block cliquer);
  
      if(this.moveBlock(blockIdx)){//on appel la fonction moveBlock() 
            if(this.checkPuzzleSolved()){
                setTimeout(()=>alert("Puzzle Solved!!"),600);
            }
        }
    }

    checkPuzzleSolved(){//return if puzzle was solved
        for(let i=0;i<this.indexes.length;i++){
            //console.log(this.indexes[i],i);
            if(i==this.emptyBlockCoords[0]+this.emptyBlockCoords[1]*this.cols)continue;
            if(this.indexes[i]!=i)return false;
        }
        return true;
    }

    setDifficulty(difficultyLevel){//set difficulty
        this.difficulty=GameDifficulty[difficultyLevel-1];
        this.randomize(this.difficulty);
    }

}

var game=new Game(1);//instantiate a new Game


//taking care of the difficulty buttons
var difficulty_buttons=Array.from(document.getElementsByClassName("difficulty_button"));
difficulty_buttons.forEach((elem,idx)=>{
    elem.addEventListener('click',(e)=>{
        difficulty_buttons[GameDifficulty.indexOf(game.difficulty)].classList.remove("active");
        elem.classList.add("active");
        game.setDifficulty(idx+1);
    });
});