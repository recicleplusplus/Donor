import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, getRedirectResult, signInWithRedirect, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

import { Firestore, Auth } from "../config/connection";
import { VerifyErroCode } from "../config/errors";
import * as Types from "../../contexts/donor/types";

import { Storage } from "../config/connection";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

import P from 'prop-types';


async function Sign(data, dispach, callback) {
  createUserWithEmailAndPassword(Auth, data.email, data.pass)
    .then(async (userCredential) => {
      const user = userCredential.user;

      delete data.pass;
      delete data.id;
      delete data.logged;
      try {
        await setDoc(doc(Firestore, "donor", user.uid), data);
        dispach({ type: Types.SETLOGGED, payload: { id: user.uid } });
      } catch (err) {
        const error = {
          title: "Falha ao cadastrar",
          content: VerifyErroCode(err.code)
        }
        callback(error);
      }
    }).catch(err => {
      const error = {
        title: "Falha ao cadastrar",
        content: VerifyErroCode(err.code)
      }
      callback(error);
    });

}
Sign.propTypes = {
  data: P.instanceOf(Map).isRequired,
  dispach: P.func.isRequired
}

async function SignOut(callback) {
  signOut(Auth).then(() => {
    callback(true);
  }).catch((err) => {
    const error = {
      title: "Falha ao Sair",
      content: VerifyErroCode(err.code)
    }
    callback(false, error);
  })
}

async function UpDate(data, dispach, callback) {
  const id = data.id;

  delete data.pass;
  delete data.id;
  delete data.logged;

  setDoc(doc(Firestore, "donor", id), data).then(() => {
    dispach({ type: Types.SETUPDATE, payload: data });
    callback(false, null);
  }).catch((err) => {
    const error = {
      title: "Falha ao atualizar dados",
      content: VerifyErroCode(err.code)
    }
    callback(true, error);
  });
}

async function UpDateTokenNotification(id, token, callback) {
  updateDoc(doc(Firestore, "donor", id), { pushTokenNotification: token }
  ).catch((err) => {
    const error = {
      title: "Falha ao atualizar dados",
      content: VerifyErroCode(err.code)
    }
    callback(error);
  });
}

async function UpDateNotificationList(id, notification, callback) {
  updateDoc(doc(Firestore, "donor", id), { notifications: arrayUnion(notification) }
  ).catch((err) => {
    const error = {
      title: "Falha ao atualizar dados",
      content: VerifyErroCode(err.code)
    }
    callback(error);
  });
}

async function Login(data, dispach, callback) {
  signInWithEmailAndPassword(Auth, data.email, data.pass)
    .then(async (userCredential) => {
      const ref = userCredential.user;
      const user = await getDoc(doc(Firestore, 'donor', ref.uid));
      dispach({ type: Types.SETLOGGED, payload: { ...user.data(), id: ref.uid } });
    }).catch((err) => {
      const error = {
        title: "Falha ao autenticar",
        content: VerifyErroCode(err.code)
      }
      callback(error);
    })
}
Login.propTypes = {
  data: P.instanceOf(Map).isRequired,
  dispach: P.func.isRequired
}

async function LoginWithGoogle(dispach) {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(Auth, provider);

  getRedirectResult(Auth)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      console.log("\n\nToken: ", token);
      console.log("\n\nUser: ", user);

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}
Login.propTypes = {
  dispach: P.func.isRequired
}

async function UploadImage(data, callback) {
  const response = await fetch(data.uri);
  const blob = await response.blob();

  uploadBytes(ref(Storage, 'images/' + data.id + '/' + 'profile'), blob).then((snapshot) => {
    getDownloadURL(ref(Storage, snapshot.metadata.fullPath.toString())).then((url) => {
      callback(false, url);
    }).catch((err) => {
      const error = {
        title: "Falha ao recuperar URL",
        content: VerifyErroCode(err.code)
      }
      callback(true, error);
    });

  }).catch((err) => {
    const error = {
      title: "Falha ao enviar a foto",
      content: VerifyErroCode(err.code)
    }
    callback(true, error);
  });
}

async function getDonorCurrentPoints(id) {
  try {
    const docSnap = await getDoc(doc(Firestore, "donor", id));
    if (docSnap.exists()) {
      return docSnap.data().points || 0;
    }
    return 0;
  } catch (error) {
    console.error("Erro ao buscar pontos do doador:", error);
    return 0;
  }
}

async function updateDonorPoints(id, pointsToAdd) {
  try {
    const docRef = doc(Firestore, "donor", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentPoints = await getDonorCurrentPoints(id);
      const newPoints = currentPoints + pointsToAdd;

      await updateDoc(docRef, { points: newPoints });
      return newPoints;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error updating points: ", error);
    return null;
  }
}

async function getTopDonorsByDonations() {
  try {
    const donorsRef = collection(Firestore, "donor");
    const q = query(
      donorsRef,
      orderBy("statistic.collectionsCompleted", "desc"),
      limit(5)
    );
    
    const querySnapshot = await getDocs(q);
    const topDonors = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      topDonors.push({
        id: doc.id,
        name: data.name || "Doador Anônimo",
        collectionsCompleted: data.statistic?.collectionsCompleted || 0,
        points: data.points || 0,
        email: data.email
      });
    });
    
    return topDonors;
  } catch (error) {
    console.error("Erro ao buscar top doadores:", error);
    return [];
  }
}


export {
  Sign,
  Login,
  LoginWithGoogle,
  SignOut,
  UpDate,
  UploadImage,
  UpDateTokenNotification,
  UpDateNotificationList,
  getDonorCurrentPoints,
  updateDonorPoints,
  getTopDonorsByDonations
};
