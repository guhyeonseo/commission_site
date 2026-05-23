import { useEffect, useState } from "react";
import { getMyCommissions } from "../api/commissionApi";

export default function
    MyCommissionPage() {

    const [list, setList] =
        useState([]);

    const load = async () => {

        const data =
            await getMyCommissions();

        setList(data);
    };

    useEffect(() => {
        load();
    }, []);

    return (

        <div>

            <h2>내 커미션</h2>

            {list.map(item => (

                <div
                    key={item.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        marginBottom: "20px"
                    }}
                >

                    <div>
                        제목:
                        {item.title}
                    </div>

                    <div>
                        가격:
                        {item.price}
                    </div>

                    <div>
                        상태:
                        {item.status}
                    </div>

                </div>
            ))}

        </div>
    );
}