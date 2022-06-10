
class Malla{
    private vertex: number[]= []; // Se enviara al Vertex Buffer (floats)
    private normals: number[]= []; // Se enviara al Normal Buffer (floats)
    private tex_coords: number[]= []; // Se enviara al TexCoords Buffer (floats)
    private indexes: number[]= []; // Se enviara al Index Buffer (enteros)
    private colors: number[]= [];

    private texture: WebGLTexture;
    
    private vertex_buffer: WebGLBuffer;
    private index_buffer: WebGLBuffer;
    private normal_buffer: WebGLBuffer;
    private color_buffer: WebGLBuffer;
    private text_buffer: WebGLBuffer;
    private img: HTMLImageElement;
    
    private position: number;
    // private color: number;

    constructor(vertex:number[], normals:number[], indexes:number[], img: HTMLImageElement, textCoords:number[])
    {
        this.vertex = vertex;
        this.normals = normals;
        // this.colors = normals;
        this.indexes = indexes;
        this.img = img;
        this.tex_coords = textCoords;
        // console.log("Las normales: ")
        //console.log(this.normals);
        //console.log(this);
        // if(typeof colors !== 'undefined'){
        //     this.colors = colors;
        // }

        // if(typeof textures !== 'undefined' && typeof coordTex !== 'undefined')
        // {
        //     this.textures = textures;
        //     this.coordTex = coordTex;
        // }
    }

    bufferData(gl:WebGL2RenderingContext){
        // console.log("EJECUTANDO BUFFER DATA");
        
        this.vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.text_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.text_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tex_coords), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexes), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
        gl.bindBuffer(gl.TEXTURE_2D, null);
        
        this.normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // console.log(this.tex_coords);
        
        // console.log("Imagen: ",this.img);
        // console.log("Textura: ",this.texture);

    }



    isPowerOf2(value: number) {
        return (value & (value - 1)) === 0;
    }

    getPosition(){
        return this.position;
    }

    getTextureBuffer(){
        return this.text_buffer;
    }

    getTexture(){
        return this.texture;
    }

    
    draw2(gl:WebGL2RenderingContext, shaderprogram:WebGLProgram){
        //console.log("se llama dibujado");
        // gl.useProgram(shaderprogram);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.drawElements(gl.TRIANGLES, this.indexes.length, gl.UNSIGNED_SHORT, 0);
    }



    draw(gl:WebGL2RenderingContext) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.drawElements(gl.TRIANGLES, this.indexes.length, gl.UNSIGNED_SHORT, 0);
    }

    getVertex(): number[]{
        return this.vertex;
    }

    getTextCoord(){
        return this.tex_coords;
    }

    getVertexBuffer():WebGLBuffer {
        return this.vertex_buffer;
    }

    getNormals(): number[]{
        return this.normals;
    }
    getNormalsBuffer(): WebGLBuffer {
        return this.normal_buffer;
    }

    getIndexes(): number[]{
        return this.indexes;
    }
    getIndexBuffer(): WebGLBuffer {
        return this.index_buffer;
    }

    // getColors(): number[]{
    //     return this.colors;
    // }
    // getColorsBuffer(): WebGLBuffer {
    //     return this.color_buffer;
    // }

    setVertex(vertex: number[]){
        if(vertex){
            this.vertex = vertex;
        }
    }

    getImage(){
        return this.img;
    }

    setNormals(normals: number[]){
        if(normals){
            this.normals = normals;
        }
    }

    setIndex(index: number[]){
        if(index){
            this.indexes = index;
        }
    }
}

export {Malla}
