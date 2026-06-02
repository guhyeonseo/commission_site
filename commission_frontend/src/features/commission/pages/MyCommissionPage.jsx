import { useEffect, useState } from "react";
import { getMyCommissions, toggleCommissionStatus, deleteCommission } from "../api/commissionApi";

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
                        <button
                            onClick={async () => {

                                await toggleCommissionStatus(
                                    item.id
                                );

                                load();
                            }}
                        >
                            {item.status === "OPEN"
                                ? "모집 마감"
                                : "모집 열기"}
                        </button>

                        <button
                            onClick={async () => {

                                const ok = window.confirm(
                                    "커미션을 삭제하시겠습니까?"
                                );

                                if (!ok) {
                                    return;
                                }

                                try {
                                    await deleteCommission(item.id);

                                    load();
                                } catch (e) {
                                    alert(
                                        e.response?.data ||
                                        "모집 중인 커미션이 있습니다."
                                    );
                                }

                                load();
                            }}
                        >
                            삭제
                        </button>

                    </div>

                </div>
            ))}

        </div>
    );
}