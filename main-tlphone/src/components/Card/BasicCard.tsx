import { Card } from '@/types'
import Link from 'next/link'
const BasicCard: React.FC<{ item: Card }> = ({ item }) => {
    
    return (
       
            <a href='http://localhost:3000/cart' className="rounded-md container shadow shadow-cyan-500/50 w-full h-full">
              <div className="pt-2">
                <p className="ms-2 mb-2 rounded-full p-1 " style={{ fontSize: "10px", width: "max-content" }}>Trả góp 0%</p>
                <img className=" rounded-md object-cover" src={item.imgdisplay} alt="" width={230} height={250}/>
                <div className="p-2 mt-3">
                  <p style={{ fontSize: "15px" }}>IPhone 16 Pro Max 256GB Chính Hãng (VN/A)</p>
                  <div className="flex flex-row">
                    <p className="mt-2" style={{ color: "crimson" }}><strong>{item.price}</strong></p>
                    <p className="ms-2  rounded-md mt-3 px-1">{item.discount}</p>
                  </div>
                  <p className="gach-ngang ">{item.price*(1-item.discount)}</p>
                </div>
              </div>
            </a>

        

    )
    
}

export default BasicCard 