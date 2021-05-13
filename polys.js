// polygon mesh routines that you should write

let vertex_list; // list of vertices
let poly_list; // list of polygons
function init_polys()
{
    vertex_list = [];
    poly_list = [];
    let t = 0;
}

function new_vertex (x, y, z, nx, ny, nz)
{
    let vertex = new Vertex();
    vertex.setX = x;
    vertex.setY = y;
    vertex.setZ = z;
    vertex.setNx = nx;
    vertex.setNy = ny;
    vertex.setNz = nz;
    vertex_list.push(vertex);
}

function new_quad (i1, i2, i3, i4)
{
    let quad = new Quad();
    quad.setI1 = i1;
    quad.setI2 = i2;
    quad.setI3 = i3;
    quad.setI4 = i4;
    poly_list.push(quad);
}

function draw_polys(show_vertices_flag, normal_flag) {
    if(normal_flag){
        normalMaterial();
    }
    for (let i = 0; i < poly_list.length; i++){
        let quad = poly_list[i];

        let v1 = vertex_list[quad.getI1];
        let v2 = vertex_list[quad.getI2];
        let v3 = vertex_list[quad.getI3];
        let v4 = vertex_list[quad.getI4]; 

        if(show_vertices_flag){
            push();
            translate(v1.getX, v1.getY, v1.getZ)
            sphere(0.75);
            pop();
            
            push();
            translate(v2.getX, v2.getY, v2.getZ);
            sphere(0.75);
            pop();
    
            push();
            translate(v3.getX, v3.getY, v3.getZ);
            sphere(0.75);
            pop();

            push();
            translate(v4.getX, v4.getY, v4.getZ);
            sphere(0.75);
            pop();
        }
        else {
            beginShape();
            vertexNormal(v1.getNx, v1.getNy, v1.getNz);
            vertex(v1.getX, v1.getY, v1.getZ);
    
            vertexNormal(v2.getNx, v2.getNy, v2.getNz);
            vertex(v2.getX, v2.getY, v2.getZ);
    
            vertexNormal(v3.getNx, v3.getNy, v3.getNz);
            vertex(v3.getX, v3.getY, v3.getZ);
    
            vertexNormal(v4.getNx, v4.getNy, v4.getNz);
            vertex(v4.getX, v4.getY, v4.getZ);
            endShape(CLOSE);
        }


    }
    
    

}

function create_cylinder(rad,x1,y1,z1,x2,y2,z2)
{  
    // nothing is showing up for this method
    let p1 = createVector(x1,y1,z1);
    let p2 = createVector(x2,y2,z2);
    let u = createVector(1, 0, 0);
    let v = createVector(0,1,0); 
    let t = p5.Vector.sub(p1, p2).normalize();

    let random = createVector(0, 2, 0);
    // a vector that is not parallel
    let np = p5.Vector.cross(t, random).normalize();

    u = p5.Vector.cross(t, np).normalize();
    v = p5.Vector.cross(u, t).normalize();

    // calculare for q
    let pi = 3.1415926535;
    for (let i = 0; i < 16; i += 1){
        // p1 + rad * u * cos (theta) +  rad * v * sin (theta)
        let a = p5.Vector.mult(p5.Vector.mult(u, cos(i*pi/8)), rad);
        let b = p5.Vector.mult(p5.Vector.mult(v, sin(i*pi/8)), rad);
        let vertex = p5.Vector.add(p5.Vector.add(p1, a), b);
        let normal = p5.Vector.add(a, b).normalize();
        new_vertex(vertex.x, vertex.y, vertex.z, normal.x, normal.y, normal.z);
        // console.log(i*pi/8);
    }
    for (let i = 0; i < 16; i += 1){
        // p2 + rad * u * cos (theta) +  rad * v * sin (theta)
        let a = p5.Vector.mult(p5.Vector.mult(u, cos(i*pi/8)), rad);
        let b = p5.Vector.mult(p5.Vector.mult(v, sin(i*pi/8)), rad);
        let vertex = p5.Vector.add(p5.Vector.add(p2, a), b);
        let normal = p5.Vector.add(a, b).normalize();
        new_vertex(vertex.x, vertex.y, vertex.z, normal.x, normal.y, normal.z);
    }
    // now our vertex list should have 32 vertices. 

    for (let i = 0; i < 16; i+=1){
        let i1, i2, i3, i4;
        if (i != 15) {
            i1 = i;
            i2 = i + 16;
            i3 = i + 17;
            i4 = i + 1;
        }
        else {
            i1 = i;
            i2 = i + 16;
            i3 = 16;
            i4 = 0;
        }
        console.log(i);
        // console.log("indices: ", i1, i2, i3, i4);
        new_quad(i1, i2, i3, i4);
    }

}

function bezier_tube(x1,y1,z1, x2,y2,z2, x3,y3,z3, x4,y4,z4, rad, num_around, num_length, nx, ny, nz)
{
    //dP(t)/dt of (1-t)^3*p1 + 3t(1-t)^2*p2 + (1-t)t^2*p3 + t^3*p4
    //dP(t) / dt =  -3(1-t)^2*p1 + 3(1-t)^2*p2-6t(1-t)*p2 -3t^2*p3+6t(1-t)*p3 + 3t^2*p4
     // we would need the tangent to find such value 
    let u = createVector(nx, ny, nz).normalize();
    // let t = 0;
    let v;
    let prev_counter = vertex_list.length; 
    // console.log(t);

    // get the 4 points
    let p1 = createVector(x1,y1,z1);
    let p2 = createVector(x2,y2,z2);
    let p3 = createVector(x3,y3,z3);
    let p4 = createVector(x4,y4,z4);
    // how many layers of quads
    for (let t = 0; t< 1 + 1/num_length; t+=1/num_length){
        
        let t_prime = t + 0.001;
        // starting point calculation
        //dP(t)/dt of (1-t)^3*p1 + 3t(1-t)^2*p2 + (1-t)t^2*p3 + t^3*p4
        let coord1 = p5.Vector.mult(p1, pow((1-t), 3)); 
        let coord2 = p5.Vector.mult(p2, 3*t*pow((1-t), 2)); 
        let coord3 = p5.Vector.mult(p3, 3*(1-t)*pow(t, 2)); 
        let coord4 = p5.Vector.mult(p4, pow(t, 3)); 
        let p = p5.Vector.add(p5.Vector.add(p5.Vector.add(coord1, coord2), coord3), coord4);

        let coord1_prime = p5.Vector.mult(p1, pow((1-t_prime), 3)); 
        let coord2_prime = p5.Vector.mult(p2, 3*t_prime*pow((1-t_prime), 2)); 
        let coord3_prime = p5.Vector.mult(p3, 3*(1-t_prime)*pow(t_prime, 2));
        let coord4_prime = p5.Vector.mult(p4, pow(t_prime, 3)); 
        let p_prime = p5.Vector.add(p5.Vector.add(p5.Vector.add(coord1_prime, coord2_prime), coord3_prime), coord4_prime);
        let t_unit_vec = p5.Vector.sub(p, p_prime).normalize();

        // differenciate the bezier equation
        //dP(t) / dt =  -3(1-t)^2*p1 + 3(1-t)^2*p2-6t(1-t)*p2 -3t^2*p3+6t(1-t)*p3 + 3t^2*p4
       
        // console.log("My t is", t);
        // console.log("My t prime is", t_prime);
        // console.log("My points are", p1, p2, p3, p4);
        console.log("My p is", p);
        // console.log("My p prime is", p_prime);
        // console.log("my tangent is", t_unit_vec); 

        v = p5.Vector.cross(u, t_unit_vec).normalize();
        u = p5.Vector.cross(t_unit_vec, v).normalize();
        // calculating the ring of vertices
        let pi = 3.1415926535;
        for (let j = 0; j < num_around; j+=1){
            let a = p5.Vector.mult(p5.Vector.mult(u, cos(j*pi/(num_around/2))), rad);
            let b = p5.Vector.mult(p5.Vector.mult(v, sin(j*pi/(num_around/2))), rad);
            let vertex = p5.Vector.add(p5.Vector.add(p, a), b);
            let normal = p5.Vector.add(a, b).normalize();

            new_vertex(vertex.x, vertex.y, vertex.z, normal.x, normal.y, normal.z);
            //100
        }

    }
    // now draw the quad
    // initialize the index
    // us the length of vertices_list 
    // vertices_list.length
    let index = prev_counter;
    for (let num_quad = 0; num_quad < num_length; num_quad +=1){
        for (let i = index; i < index + num_around; i+=1){
            let i1, i2, i3, i4;
            if (i != (index + num_around) - 1) {
                i1 = i;
                i2 = i + num_around;
                i3 = i + num_around + 1;
                i4 = i + 1;
            }
            else {
                i1 = i;
                i2 = i + num_around;
                i3 = index + num_around;
                i4 = index;
            }
            new_quad(i1, i2, i3, i4);
            console.log(i1, i2, i3, i4); 
        }
        index += num_around;
    }
    //Return the final normal u on exit from the function.
    return u;
}
