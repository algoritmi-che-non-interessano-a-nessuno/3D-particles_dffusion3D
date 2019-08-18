
export default class Vector3D
{

    constructor( x, y, z )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }


    copy()
    {
        return new Vector3D( this.x, this.y, this.z );
    }


    module()
    {
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
    }


    negate()
    {
        this.x = - this.x;
        this.y = - this.y;
        this.z = - this.z;
    }

    normalize()
    {
        let length = this.module();
        if ( length > 0 )
        {
            this.x /= length;
            this.y /= length;
            this.z /= length;
        }
        else
        {
            this.x = undefined;
            this.y = undefined;
            this.z = undefined;
        }
    }


    // ritorna il versore
    normalized()
    {
        let ret = undefined;

        let length = this.module();
        if ( length > 0 )
        {
            ret = new Vector3D( this.x / length, this.y / length, this.z / length );
        }

        return ret;
    }


    add( vec )
    {
        return new Vector3D( this.x + vec.x, this.y + vec.y, this.z + vec.z );
    }


    subtract( vec )
    {
        return new Vector3D( this.x - vec.x, this.y - vec.y, this.z - vec.z );
    }


    increment( dv )
    {
        this.x += dv.x;
        this.y += dv.y;
        this.z += dv.z;
    }


    decrement( dv )
    {
        this.x -= dv.x;
        this.y -= dv.y;
        this.z -= dv.z;
    }


    scale( k )
    {
        this.x *= k;
        this.y *= k;
        this.z *= k;
    }


    multiply( k ) 
    {
        return new Vector3D( k * this.x, k * this.y, k * this.z );
    }


    dot( vec )
    {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }


    distance( vec )
    {
        return this.subtract( vec ).module();
    }


    angle( vec )
    {
        return Math.acos( this.dot( vec ) / ( this.module() * vec.module() ) );
    }


    // ritorna la componente lungo v 
    parallelComponent( vec )
     {
         const vecModule = vec.module();
         if ( vecModule > 0 )
         {
             // prodotto scalare diviso modulo del vettore proiezione 
            let length = ( this.x * vec.x + this.y * vec.y + this.z * vec.z  ) / ( vecModule ); 
            
            let vUnit = vec.multiply( 1 / vecModule );

            return vUnit.multiply( length );
         }
         else
         {
            return new Vector3D( 0.0, 0.0, 0.0 );
         }

    }

    
    // ritorna la componente perpendicolare a v
    perpendicularComponent( vec )
    {
        let parComp = this.parallelComponent( vec );  // componente lungo v
        return this.subtract( parComp );
    }


}

