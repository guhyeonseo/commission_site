import { useEffect, useState } from "react";

import {
    getArtistOrders,
    workDone,
    uploadResult,
    startWork
} from "../api/paymentApi";

export default function ArtistOrderPage() {

    const [list, setList] = useState([]);

    const load = async () => {

        const res =
            await getArtistOrders();

        setList(res.data);
    };

    useEffect(() => {
        load();
    }, []);

    const handleDone = async (paymentId) => {

        await workDone(paymentId);

        load();
    };

    const [files, setFiles] = useState({});

    const handleUpload = async (
        paymentId
    ) => {
        console.log(files);
        console.log(paymentId);
        console.log(files[paymentId]);

        const file = files[paymentId];

        if (!file) {
            alert("파일 선택");
            return;
        }

        await uploadResult(
            paymentId,
            file
        );

        load();
    };

    const handleStart = async (paymentId) => {

        await startWork(paymentId);

        load();
    };

    return (
        <div>

            <h2>내 주문 목록</h2>

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
                        커미션:
                        {item.commissionTitle}
                    </div>

                    <div>
                        구매자:
                        {item.buyerNickname}
                    </div>

                    <div>
                        금액:
                        {item.amount}
                    </div>

                    <div>
                        상태:
                        {item.status}
                    </div>

                    {item.status === "WAITING_START" && (

                        <button
                            onClick={() =>
                                handleStart(item.id)
                            }
                        >
                            작업 시작
                        </button>
                    )}

                    {item.status === "IN_PROGRESS" && (

                        <div>

                            <input
                                type="file"
                                onChange={(e) => {

                                    const file =
                                        e.target.files[0];

                                    setFiles(prev => ({
                                        ...prev,
                                        [item.id]: file
                                    }));

                                    console.log(file);
                                }}
                            />

                            <button
                                onClick={() =>
                                    handleUpload(item.id)
                                }
                            >
                                완성본 업로드
                            </button>

                        </div>
                    )}

                </div>
            ))}

        </div>
    );
}