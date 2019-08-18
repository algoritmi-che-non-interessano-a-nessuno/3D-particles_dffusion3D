import Vector3D from "./vector3d.js";


export default class Particle
{

    /**
     * @param m     Massa
     * @param p0    Posizione
     * @param r     Raggio
     */
    constructor( m, p0, r )
    {
        this.m = m;
        this.p = p0;
        this.v = new Vector3D( 0, 0, 0 );
        this.r = r;
    }


    checkXplusWallCollision( wall )
    {
        if ( this.p.x > wall - this.r )
        {
            // a rigore andrebbero riposizionate x e y in funzione della direzione del movimento
            this.p.x = wall - this.r; 
            this.v.x *= -1;
        }	
    }


    checkXminusWallCollision( wall )
    {
        if ( this.p.x < wall + this.r )
        {
            // a rigore andrebbero riposizionate x e y in funzione della direzione del movimento
            this.p.x = wall + this.r; 
            this.v.x *= -1;
        }	
    }
    

    checkYplusWallCollision( wall )
    {
        if ( this.p.y > wall - this.r )
        {
            // a rigore andrebbero riposizionate x e y in funzione della direzione del movimento
            this.p.y = wall - this.r; 
            this.v.y *= -1;
        }	
    }


    checkYminusWallCollision( wall )
    {
        if ( this.p.y < wall + this.r )
        {
            // a rigore andrebbero riposizionate x e y in funzione della direzione del movimento
            this.p.y = wall + this.r; 
            this.v.y *= -1;
        }	
    }


    checkZplusWallCollision( wall )
    {
        if ( this.p.z > wall - this.r )
        {
            // a rigore andrebbero riposizionate x e y in funzione della direzione del movimento
            this.p.z = wall - this.r; 
            this.v.z *= -1;
        }	
    }


    checkZminusWallCollision( wall )
    {
        if ( this.p.z < wall + this.r )
        {
            // a rigore andrebbero riposizionate x e y in funzione della direzione del movimento
            this.p.z = wall + this.r; 
            this.v.z *= -1;
        }	
    }


    // collisione tra due particelle
    checkCollision( p2 )
    {
        let dist = this.p.subtract( p2.p );
        let distModule = dist.module();
        let distUnit = dist.normalized();
        if ( distModule < ( this.r + p2.r ) )
        {
            // componenti velocità parallele alla congiungente i centri delle particelle
            // prima dell'impatto
            let parallelV1 = this.v.parallelComponent( dist );
            let parallelV2 = p2.v.parallelComponent( dist );

            // componenti velocità perpendicolari alla congiungente i centri delle particelle
            // prima dell'impatto
            let perpendicularV1 = this.v.subtract( parallelV1 );
            let perpendicularV2 = p2.v.subtract( parallelV2 );

            // riposizionamento al punto di contatto
            let l = this.r + p2.r - distModule;
            let vRel = this.v.subtract( p2.v ).module();
            let k = - l / vRel;
            let s1 = parallelV1.multiply( k );
            let s2 = parallelV2.multiply( k );
            this.p = this.p.add( s1 );
            p2.p = p2.p.add( s2 );

            // componenti velocità parallele alla congiungente i centri delle particelle
            // dopo l'impatto
            let m1 = this.m;
            let m2 = p2.m;

            let u1 = parallelV1.dot( distUnit );
            let u2 = parallelV2.dot( distUnit );

            let v1 = ( ( m1 - m2 ) * u1 + 2 * m2 * u2 ) / ( m1 + m2 );
            let v2 = ( ( m2 - m1 ) * u2 + 2 * m1 * u1 ) / ( m1 + m2 );

            // componenti velocità perpendicolari alla congiungente i centri delle particelle
            // dopo l'impatto
            parallelV1 = distUnit.multiply( v1 );
            parallelV2 = distUnit.multiply( v2 );
            
            // velocità finali
            this.v = parallelV1.add( perpendicularV1 );
            p2.v = parallelV2.add( perpendicularV2 );      
        }
    }


    move( dt )
    {
        if ( dt < 0.2 )
        {
            let dp = this.v.multiply( dt );      // velocità vettoriale per intervallo di tempo

            // limitazione spostamento massimo per evitare tunneling o distanze === 0
            const dpModule = dp.module();

            if ( dpModule > 0.8 * this.r )
            {
                dp = dp.multiply( 0.8 * this.r / dpModule );  // 80% del raggio
                this.v = dp.multiply( 1 / dt );               // ricalcolo velocità per coerenza 
            }

            
            this.p.increment( dp );                           // incremento posizione
        }
        
    }

}