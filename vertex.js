class Vertex{
    contructor(){       
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.nx = 0;
        this.ny = 0;
        this.nz = 0;
    }
    set setX(x){
        this.x = x;
    }
    set setY(y){
        this.y = y;
    }
    set setZ(z){
        this.z = z;
    }
    set setNx(nx){
        this.nx = nx;
    }
    set setNy(ny){
        this.ny = ny;
    }
    set setNz(nz){
        this.nz = nz;
    }
    
    get getX(){
        return this.x;
    }
    get getY(){
        return this.y;
    }
    get getZ(){
        return this.z;
    }

    get getNx(){
        return this.nx;
    }
    get getNy(){
        return this.ny;
    }
    get getNz(){
        return this.nz;
    }
}