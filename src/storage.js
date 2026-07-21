// // example history file
// // commits array
// // [
// //     {
// //         commit_id: 1,
// //         commit_desc: desc,
// //         files:{
// //                     file1.txt: hash_of_file1,
// //                     file2.txt: hash_of_file2
// //               }
// //     }
// // ]

// modified plan: supporting nested folders
// commits array
// [
//   {
//     commit_id: 1,
//     commit_desc: "desc",
//     filesAndFolders: {
//       folder1: {
//         "file1.txt": "hash_of_file1",
//         "file2.txt": "hash_of_file2",
//         "file3.txt": "hash_of_file3",
//       },
//       folder2: {
//         "file4.txt": "hash_of_file4",
//         "file5.txt": "hash_of_file5",
//         "file6.txt": "hash_of_file6",
//       },
//       "file7.txt": "hash_of_file7",
//       "file8.txt": "hash_of_file8",
//     },
//   },
// ];
