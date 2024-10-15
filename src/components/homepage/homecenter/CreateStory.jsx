import { background } from '@chakra-ui/react';
import React from 'react';
import Guy from '../../../images/stories/guy.jpg'  //đặt tạm sau này chuyển thành avt
const CreateStory = (currentUser) => {
    return (
        <div style={{
        }} className= "story">
            <div>
                <img style={{ borderRadius: '10px' }}
                    alt=""
                    className="x5yr21d xl1xv1r xh8yej3"
                    referrerPolicy="origin-when-cross-origin"
                    src={Guy}
                />
            </div>
            <div></div>
            <div>
                <div className="x6s0dn4 x1jx94hy xlid4zk x13tp074 x1qns1p2 xipx5yg x78zum5 x1vqgdyp xl56j7k x10l6tqk xcrr8yc x100vrsf">
                    <div className="x6s0dn4 xwnonoy xlid4zk x13tp074 x1qns1p2 xipx5yg x78zum5 x10w6t97 xl56j7k x1td3qas" style={{backgroundColor: "rgb(46, 129, 244)"}}>
                        <svg
                            viewBox="0 0 20 20"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="x19dipnz x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"
                            style={{ "--color": "var(--always-white)" }}
                        >
                            <g fillRule="evenodd" transform="translate(-446 -350)">
                                <g fillRule="nonzero">
                                    <path
                                        d="M95 201.5h13a1 1 0 1 0 0-2H95a1 1 0 1 0 0 2z"
                                        transform="translate(354.5 159.5)"
                                    ></path>
                                    <path
                                        d="M102.5 207v-13a1 1 0 1 0-2 0v13a1 1 0 1 0 2 0z"
                                        transform="translate(354.5 159.5)"
                                    ></path>
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <span dir="auto">
                        <span style={{ WebkitBoxOrient: "vertical", WebkitLineClamp: 3, display: "-webkit-box" }}>
                            Create story
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );

};

export default CreateStory;