
import { Card } from '@/types'
const BasicCard: React.FC<{ item: Card }> = ({ item }) => {
    
    return (
        <div>
            <div className="rounded-md container shadow" style={{ height: "max-content", width: "240px", background: "white" }}>
              <div className="pt-2">
                <p className="ms-2 rounded-full p-1 bg" style={{ fontSize: "10px", width: "max-content" }}>Trả góp 0%</p>
                <img className=" rounded-md " src={item.imgdisplay} alt="" width={110} height={110} style={{ height: "238px", width: "240px" }} />
                <div className="p-2 mt-3">
                  <p style={{ fontSize: "15px" }}>IPhone 16 Pro Max 256GB Chính Hãng (VN/A)</p>
                  <div className="flex flex-row">
                    <p className="mt-2" style={{ color: "crimson" }}><strong>{item.price}</strong></p>
                    <p className="ms-2 bg2 rounded-md mt-3 px-1">{item.discount}</p>
                  </div>
                  <p className="gach-ngang ">{item.price*(1-item.discount)}</p>
                </div>
              </div>
            </div>
          </div>
    )
}

export default BasicCard 