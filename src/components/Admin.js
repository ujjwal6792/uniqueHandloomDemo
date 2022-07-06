import React, { useState, useEffect } from "react";
import "../style/Admin.css";
import { useNavigate } from "react-router-dom";
import { auth, storage, db } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useStateValue } from "./StateProvider";
import WishlistDisplay from "./WishlistDisplay"
import UserDetails from "./UserDetails";
import firebase from "./firebase";

function Admin() {
  //Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [{ user }] = useStateValue();
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        navigate("/admin");
        setEmail("");
        setPassword("");
      })
      .catch((error) => alert(error.message));
  };

  //   Log Out
  const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
      setEmail("");
      setPassword("");
    }
  };
  // upload fields
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [id, setId] = useState("");
  const [edit, setEdit] = useState(null);
  const [editset, setEditSet] = useState(null);

  //image file extension check
  const [imageError, setImageError] = useState("");
  //firebase message
  const [sucess, setSucess] = useState("");
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  // image function
  const types = ["image/avif", "image/webp"];
  const handleImage = (e) => {
    let selectedimg = e.target.files[0];
    if (selectedimg && types.includes(selectedimg.type)) {
      setImage(selectedimg);
      setImageError("");
    } else {
      setImage(null);
      setImageError("please select a valid avif image format file");
    }
  };

  //   file upload function
  const handleUpload = (e) => {
    e.preventDefault();
    if (!id) {
      const file = image;
      const storageRef = ref(storage, `${category}/${image.name}`);
      const metadata = {
        contentType: "image/avif",
      };
      const uploadImage = uploadBytesResumable(storageRef, file, metadata);
      uploadImage.on(
        "state_changed",
        (snapshot) => {
          return snapshot;
        },
        (error) => setError(error.message),
        () => {
          getDownloadURL(uploadImage.snapshot.ref).then((img) => {
            db.collection("products")
              .add({
                name,
                description,
                size,
                category,
                price,
                img,
              })
              .then(() => {
                setSucess(`product added successfully`);
                setDescription("");
                setPrice("");
                setSize("");
                setName("");
                document.getElementById(`imageFile`).value = "";
                setError("");
                setImageError("");
                setTimeout(() => {
                  setSucess("");
                }, 3000);
              })
              .catch((error) => setError(error.message));
          });
        }
      );
    } else {
      try {
        updateDoc(doc(db, "products", id), {
          name,
          size,
          price,
          category,
          description,
        });
        setEdit(true);
        setSucess(`product edited successfully`);
        setDescription("");
        setPrice("");
        setSize("");
        setName("");
        document.getElementById(`imageFile`).value = "";
        setError("");
        setImageError("");
        setTimeout(() => {
          setSucess("");
        }, 3000);
      } catch {
        console.log(`err`);
      }
    }
  };
  // edit and delete buttons
  const editDb = async (e, id, cat) => {
    setEditSet(true);
    e.preventDefault();
    const editRef = doc(db, cat, id);
    const snapshot = await getDoc(editRef);
    let editdata = { ...snapshot.data(), id: snapshot.id };
    setId(editdata.id);
    setName(editdata.name);
    setPrice(editdata.price);
    setSize(editdata.size);
    setDescription(editdata.description);
  };

  const deleteDb = (e, id, cat) => {
    e.preventDefault();
    const deleteRef = doc(db, cat, id);
    if (window.confirm("Are you sure?")) {
      deleteDoc(deleteRef);
      setSucess("Website Deleted");
      setTimeout(() => {
        setSucess("");
      }, 5000);
    }
  };

  // user wishlist display
  const [wishlistRender, setWishlistRender] = useState(null);

  const userRef = firebase
  .firestore()
  .collectionGroup('wishlist')
  

  useEffect(() => {
    userRef
    .orderBy("date", "desc")
    .get().then( (docs)=>
        setWishlistRender( docs.docs.map((doc) =>
          ({...doc.data(), id: doc.id}) ) 
          )    
      )
},[])

  return (
    <div className="admin">
      {!user && navigate("/login")}
      <div className="successContainer">
        {sucess && (
          <div className="successText">
            {sucess}
            <br />
          </div>
        )}
      </div>
      {user?.uid == "AJC1CI0AfxPrZFIy2ojl8JCSLs63" && (
        <form className="adminInput" onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Name"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
          <input
            type="text"
            placeholder="Size"
            required
            onChange={(e) => {
              setSize(e.target.value);
            }}
            value={size}
          />
          <input
            type="text"
            placeholder="Description"
            required
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
          />
          <input
            type="text"
            placeholder="Price"
            required
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
          <input
            type="file"
            className="imageFile"
            name="image"
            id="imageFile"
            onChange={handleImage}
          />
          <select
            name="categories"
            id="categories"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="">Choose Category</option>
            <option value="indianApparel">indianApparel</option>
            <option value="bedsheets">Bedsheets</option>
            <option value="carpets">carpets</option>
            <option value="cushions">cushions</option>
            <option value="towels">towels</option>
            <option value="mattress">mattress</option>
          </select>
          <button type="submit">
            {" "}
            {editset ? "Edit Product" : "Add Product"}
          </button>
          <button onClick={handleAuthenticaton}>Log Out</button>

          {imageError && (
            <>
              <div className="errorText">{imageError}</div>
              <br />
            </>
          )}
        </form>
      )}
      <div>
        {error && (
          <>
            <br />
            <div className="errotText">{error}</div>
          </>
        )}
      </div>
        <div className="userWishlistAdmin">
        {wishlistRender?.map((item) => (
          <>
          <UserDetails uid={item.uid}/>
          <WishlistDisplay key={item.id.slice(16,40)} basket={item.
          basket} id={item.id} />
          </>
          ))}
        </div>
    </div>
  );
}

export default Admin;
