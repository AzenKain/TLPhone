"use client"
import { Search } from '@/types/search'
import { useRouter } from 'next/navigation'
import { ProductType } from "@/types";
import {Backend_URL} from "@/lib/Constants";

const BasicCard: React.FC<{ item: ProductType }> = ({ item }) => {
  const router = useRouter()

  const displayPrice = item.details?.variants?.[0]?.displayPrice;
  const imgUrl = item.details?.imgDisplay?.[0]?.url ? Backend_URL + item.details?.imgDisplay?.[0]?.url : "./no-item-found.png";

  return (
      <div className='cursor-pointer border rounded-lg shadow p-4 hover:shadow-md transition bg-amber-50 w-50 h-80 ' onClick={() => router.push(`/product/${item.id}`)}>
        <div className="">
          <div className="pt-2">
            <p className="ms-2 rounded-full p-1 bg text-center mb-2" style={{ fontSize: "10px", width: "max-content", }}>Trả góp 0%</p>
            <div className="flex justify-center group">
              <img
                  className="rounded-md w-24 h-32 object-fit-fill transform transition duration-100 group-hover:scale-105"
                  src={imgUrl}
                  alt=""
                  width={110}
                  height={220}

              />
            </div>
            <div className="p-2 mt-3">
              <p className="text-sm">{item.name}</p>
              <div className="flex flex-row">
                <p className="mt-2" style={{ color: "crimson" }}>
                  <strong>
                    {displayPrice
                        ? (displayPrice * (100 - 0) / 100).toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })
                        : 'N/A'}
                  </strong>
                </p>
                <p className="ms-2 bg2 rounded-md mt-3 px-1">-{0}%</p>
              </div>
              <p className="gach-ngang">
                {displayPrice
                    ? displayPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })
                    : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default BasicCard
